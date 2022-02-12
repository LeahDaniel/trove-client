import React, { useState } from "react"
import { Badge, Card, CardBody, CardSubtitle, CardText, CardTitle, UncontrolledAlert } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';
import moveIcon from '../../images/MoveFolder3.png';
import sendIcon from '../../images/SendIcon.png';
import { useHistory } from "react-router";
import { PlatformModal } from "./PlatformModal";
import { RecommendationModal } from "../Social/RecommendationModal";


export const Game = ({ game, showDetail, setGames }) => {
    const history = useHistory()
    const [platformOpenBoolean, setPlatformOpenBoolean] = useState(false)
    const [recommendationOpenBoolean, setRecommendationOpenBoolean] = useState(false)
    const [successOpenBoolean, setSuccessOpenBoolean] = useState(false)
    const [chosenPlatformId, setChosenPlatformId] = useState(0)

    //delete game by id. If a current game, set games with current games, else set games with queued games (to update state appropriately based on current user view)
    const deleteGame = (gameId) => {
        if (game.current === true) {
            GameRepo.delete(gameId)
                .then(() => GameRepo.getAll("True")
                    .then(setGames))
        } else {
            GameRepo.delete(gameId)
                .then(() => GameRepo.getAll("False")
                    .then(setGames))
        }
    }

    //PUT operation to modify a game from queued to current (false to true). Called in button click.
    const addToCurrent = () => {
        GameRepo.modifyGame({
            name: game.name,
            current: true,
            multiplayer_capable: game.multiplayer_capable,
            platforms: [chosenPlatformId],
            tags: game.tags.map(tag => tag.id)
        }, game.id)
            //after doing PUT operation, push user to the current list, where the game is now located
            .then(() => history.push("/games/current"))
    }

    return (
        <div className="mt-4">
            {/*
                Modal that pops up if the game has multiple platforms on it when user clicks "add to current".
                Pass state of game, addToCurrent function, and both the state and setter for the openBoolean
            */}
            <PlatformModal openBoolean={platformOpenBoolean} setOpenBoolean={setPlatformOpenBoolean}
                game={game} addToCurrent={addToCurrent} setChosenPlatformId= {setChosenPlatformId} />
            {/*
                Modal that pops up on send button click
            */}
            <RecommendationModal openBoolean={recommendationOpenBoolean} setOpenBoolean={setRecommendationOpenBoolean}
                game={game} setGameRecoSuccess={setSuccessOpenBoolean} />

            <Card
                body
                color="light"
                className="rounded shadow-sm border border-info"
            >
                {
                    showDetail
                        ?
                        <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-1">
                            {/* 
                                If the present game is in the queue, display a "Add to Current" button.
                            */}
                            {
                                game.current === false 
                                    ? <button className="imgButton">
                                        <img src={moveIcon} alt="Move to Current" style={{ maxWidth: 40, maxHeight: 40 }} onClick={() => {
                                            game.platforms?.length > 1
                                                ? setPlatformOpenBoolean(true)
                                                : addToCurrent()
                                        }} />
                                    </button>
                                    : ""
                            }
                            {/* onClick of the edit button, push user to form route, and send along state of the game to the location */}
                            <button className="imgButton">
                                <img src={editIcon} alt="Edit" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => {
                                        history.push(`/games/${game.id}/edit`)
                                    }
                                } />
                            </button>
                            <button className="imgButton">
                                <img src={sendIcon} alt="Send" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => {
                                        setRecommendationOpenBoolean(true)
                                    }
                                } />
                            </button>
                            {/* onClick of delete button (trash icon) call deleteGame function with argument of the id of the present game. */}
                            <button className="imgButton">
                                <img src={deleteIcon} alt="Delete" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => { return deleteGame(game.id) }
                                } />
                            </button>

                        </div>
                        : ""
                }


                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4" className={showDetail ? "mb-3 mt-0" : "my-3 pt-3"}>
                        {/* display game names */}
                        {game.name}
                    </CardTitle>
                    <CardSubtitle
                        className="text-mutedPlus"
                        tag="h6"

                    >
                        {/* display "multiplayer capable" if true */}
                        {game.multiplayer_capable === true ? "Multiplayer Capable" : ""}
                    </CardSubtitle>
                    <CardText className="my-3">
                        {/* display platforms (if current, display as "playing", else display as "available") */}
                        {game.current ? "Playing" : "Available"} on {
                            game.platforms?.map(platform => {
                                return platform.name
                            }).join(", ")
                        }
                    </CardText>
                    <CardText className="my-3">
                        {/* map through the taggedGames for the present game, and display the tag associated with each in a Badge format */}
                        {
                            game.tags?.map(tag => {
                                return <Badge className="my-1 me-1 shadow-sm " key={tag.id} style={{ fontSize: 15, fontWeight: 600 }} color="tags" pill>
                                    {tag.tag}
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
                </CardBody>
            </Card>
            {
                successOpenBoolean
                    ? <UncontrolledAlert
                        className=" shadow-sm"
                        color="success">
                        Recommendation sent!
                    </UncontrolledAlert>
                    : ""
            }


        </div>

    )
}