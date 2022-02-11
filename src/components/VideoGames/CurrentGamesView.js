import React, { useEffect, useState } from "react"
import { GameList } from "./GameList"
import { SearchGames } from "./SearchGames"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { GameRepo } from "../../repositories/GameRepo";
import { Button, Card } from "reactstrap";

export const CurrentGamesView = () => {
    const history = useHistory()
    const [games, setGames] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [userEntries, setUserEntries] = useState({
        name: "",
        multiplayer: null,
        platform: "0",
        tags: new Set()
    })

    useEffect(
        () => {
            //variables for whether or not the user has filled in each filter
            const multiplayerExist = userEntries.multiplayer !== ""
            const platformExist = userEntries.platform !== "0"
            const tagsExist = userEntries.tags.size > 0
            const nameExist = userEntries.name !== ""

            let filters = {
                current: "True",
                multiplayer: "",
                nameSearch: "",
                platformId: "",
                tagArray: null
            }

            if (platformExist) filters.platformId = userEntries.platform
            if (multiplayerExist) filters.multiplayer = userEntries.multiplayer
            if (nameExist) filters.nameSearch = userEntries.name
            if (tagsExist) filters.tagArray = Array.from(userEntries.tags)

            if (nameExist || multiplayerExist || tagsExist || platformExist) {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }

            GameRepo.getAll(filters.current, filters.nameSearch, filters.platformId, filters.multiplayer, filters.tagArray)
                .then(setGames)
                .then(() => setLoading(false))

        }, [userEntries]
    )

    return (
        <div className="row justify-content-evenly">
            <div className="col-3">
                {/* clickable "add" image to bring user to form */}
                <div className="row justify-content-center mt-5">
                    <Button color="info" size="sm" className="col-sm-10 col-md-8 col-lg-6" onClick={
                        () => history.push("/games/create")
                    }>
                        <img src={addIcon} alt="Add" style={{ maxWidth: 25 }} className="me-2"
                        />
                        Add Game
                    </Button>
                </div>

                <SearchGames setUserEntries={setUserEntries} userEntries={userEntries} />
            </div>
            {
                isLoading
                    ? < Card className="col-7 d-flex align-items-center justify-content-center border-0" />
                    : <GameList games={games} setGames={setGames} userAttemptedSearch={userAttemptedSearch} />
            }

        </div>
    )
}