import React, { useEffect, useState } from "react"
import { ShowList } from "./ShowList"
import { SearchShows } from "./SearchShows"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { ShowRepo } from "../../repositories/ShowRepo";
import { Button, Card } from "reactstrap";

export const CurrentShowsView = () => {
    const history = useHistory()
    const [shows, setShows] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [userEntries, setUserEntries] = useState({
        name: "",
        service: "0",
        tags: new Set()
    })


    useEffect(
        () => {
            const serviceExist = userEntries.service !== "0"
            const tagsExist = userEntries.tags.size > 0
            const nameExist = userEntries.name !== ""


            let filters = {
                current: "True",
                nameSearch: "",
                streamingServiceId: "",
                tagArray: null
            }

            if (serviceExist) filters.streamingServiceId = userEntries.service
            if (nameExist) filters.nameSearch = userEntries.name
            if (tagsExist) filters.tagArray = Array.from(userEntries.tags)

            if (nameExist || serviceExist || tagsExist) {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }

            ShowRepo.getAll(filters.current, filters.tagArray, filters.nameSearch,  filters.streamingServiceId)
                .then(setShows)
                .then(() => setLoading(false))

        }, [userEntries]
    )


    return (
        <div className="row justify-content-evenly" >
            <div className="col-3">
                {/* clickable "add" image to bring user to form */}
                <div className="row justify-content-center mt-5">
                    <Button color="info" size="sm" className="col-sm-10 col-md-8 col-lg-6" onClick={
                        () => history.push("/shows/create")
                    }>
                        <img src={addIcon} alt="Add" style={{ maxWidth: 25 }} className="me-2"
                        />
                        Add Show
                    </Button>
                </div>

                <SearchShows setUserEntries={setUserEntries} userEntries={userEntries} />
            </div>
            {
                isLoading
                    ? < Card className="col-7 d-flex align-items-center justify-content-center border-0" />
                    : <ShowList shows={shows} setShows={setShows} userAttemptedSearch={userAttemptedSearch} />
            }

        </div>
    )
}