import React, { useEffect, useState } from "react"
import { Badge, Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';
import { useHistory } from "react-router";
import { PlatformModal } from "./PlatformModal";


export const Game = ({ game, setGames }) => {
    const [presentGame, setGame] = useState([])
    const [openBoolean, setOpenBoolean] = useState(false)
    const history = useHistory()

    //any time the game prop's id state changes (on page load) get individual game with expanded user, embedded taggedGames (with embedded tags), and embedded gamePlatforms (with embedded platforms)
    useEffect(() => {
        GameRepo.get(game.id)
            .then(setGame)
    }, [game.id])

    //delete game by id. If a current game, set games with current games, else set games with queued games (to update state appropriately based on current user view)
    const deleteGame = (gameId) => {
        if (presentGame.current === true) {
            GameRepo.delete(gameId)
                .then(() => GameRepo.getAllCurrent()
                    .then(setGames))
        } else {
            GameRepo.delete(gameId)
                .then(() => GameRepo.getAllQueue()
                    .then(setGames))
        }
    }

    //PUT operation to modify a game from queued to current (false to true). Called in button click.
    const addToCurrent = () => {
        GameRepo.modifyGame({
            name: presentGame.name,
            userId: presentGame.userId,
            current: true,
            multiplayerCapable: presentGame.multiplayerCapable
        }, presentGame.id)
            //after doing PUT operation, push user to the current list, where the game is now located
            .then(() => history.push("/games/current"))
    }

    return (
        <div className="mt-5">
            {/*
                Modal that pops up if the game has multiple platforms on it when user clicks "add to current".
                Pass state of presentGame, addToCurrent function, and both the state and setter for the openBoolean
            */}
            <PlatformModal openBoolean={openBoolean} setOpenBoolean={setOpenBoolean}
                presentGame={presentGame} addToCurrent={addToCurrent} />

            <Card
                body
                color="light"
            >
                {
                    setGames
                        ? <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                            {/* onClick of delete button (trash icon) call deleteGame function with argument of the id of the present game. */}
                            <img className="me-3" src={deleteIcon} alt="Delete" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                                () => { return deleteGame(presentGame.id) }
                            } />
                            {/* onClick of the edit button, push user to form route, and send along state of the presentGame to the location */}
                            <img className="me-1" src={editIcon} alt="Edit" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                                () => {
                                    history.push({
                                        pathname: "/games/create",
                                        state: presentGame
                                    })
                                }
                            } />
                        </div>
                        : ""
                }


                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4" className={setGames? "mb-3 mt-0" :  "my-3 pt-3"}>
                        {/* display game names */}
                        {presentGame.name}
                    </CardTitle>
                    <CardSubtitle
                        className=" text-muted"
                        tag="h6"
                    >
                        {/* display "multiplayer capable" if true */}
                        {presentGame.multiplayerCapable === true ? "Multiplayer Capable" : ""}
                    </CardSubtitle>
                    <CardText className="my-3">
                        {/* display platforms (if current, display as "playing", else display as "available") */}
                        {presentGame.current ? "Playing" : "Available"} on {
                            presentGame.gamePlatforms?.map(gamePlatform => {
                                return gamePlatform.platform?.name
                            }).join(", ")
                        }
                    </CardText>
                    <CardText className="my-3">
                        {/* map through the taggedGames for the present game, and display the tag associated with each in a Badge format */}
                        {
                            presentGame.taggedGames?.map(taggedGame => {
                                return <Badge className="my-1 me-1" key={taggedGame.id} style={{ fontSize: 15 }} color="info" pill>
                                    {taggedGame.tag?.tag}
                                </Badge>
                            })
                        }
                    </CardText>
                    {/* 
                        If the present game is in the queue, display a "Add to Current" button.
                        If the present game has more than one game platform, display a modal that allows the user
                        to select one platform, then call the addToCurrent function on the modal. 
                        If the present game has only one platform, call the addToCurrent function on this button.
                    */}
                    {
                        presentGame.current === false && setGames
                            ? <Button onClick={() => {
                                presentGame.gamePlatforms?.length > 1
                                    ? setOpenBoolean(true)
                                    : addToCurrent()
                            }
                            }> Add to Current </Button>
                            : ""
                    }
                </CardBody>
            </Card>
        </div>

    )
}