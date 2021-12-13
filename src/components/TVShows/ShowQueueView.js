import { useEffect, useState } from "react/cjs/react.development"
import { ShowList } from "./ShowList"
import { SearchShows } from "./SearchShows"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { ShowRepo } from "../../repositories/ShowRepo";

export const ShowQueueView = () => {
    const [userEntries, setUserEntries] = useState({
        name: "",
        service: "0",
        tag: "0"
    })
    const history = useHistory()
    const [shows, setShows] = useState([])
    const [midFilterShows, setFilteredShows] = useState([])


    useEffect(
        () => {
            ShowRepo.getAllQueue()
                .then(setShows)
        }, []
    )
    useEffect(
        () => {
            if (userEntries.name === "") {
                ShowRepo.getAllQueue()
                    .then(setFilteredShows)
                    .then(setShows(determineFilters()))
            } else {
                ShowRepo.getAllQueueBySearchTerm(userEntries.name)
                    .then(setFilteredShows)
                    .then(setShows(determineFilters()))

            }
        }, [userEntries]
    )


    const determineFilters = () => {
        const serviceExist = userEntries.service !== "0"
        const noService = userEntries.service === "0"
        const tagExist = userEntries.tag !== "0"
        const noTag = userEntries.tag === "0"

        const serviceId = parseInt(userEntries.service)
        const tagId = parseInt(userEntries.tag)

        const showsByTagOnly = midFilterShows.filter(show => {
            const foundTaggedShow = show.taggedShows?.find(taggedShow => taggedShow.tagId === tagId)
            if (foundTaggedShow) {
                return true
            } else {
                return false
            }
        })
        const showsByServiceOnly = midFilterShows.filter(show => show.streamingServiceId === serviceId)
        const showsByTagAndService = showsByTagOnly.filter(show => showsByServiceOnly.includes(show))

        if (noService && noTag) {
            return midFilterShows
        } else if (serviceExist && noTag) {
            return showsByServiceOnly
            //if a user has not been chosen and the favorites box is checked
        } else if (noService && tagExist) {
            return showsByTagOnly
            //if a user has been chosen AND the favorites box is checked.
        } else if (serviceExist && tagExist) {
            return showsByTagAndService
        }
    }

    return (
        <div className="d-flex flex-row flex-wrap">
            <ShowList shows={shows} setShows={setShows} />
            <div>
                {/* clickable "add" image to bring user to form */}
                <img className="m-4" src={addIcon} alt="Add" style={{ maxWidth: 40, alignSelf: "flex-end" }}
                    onClick={
                        () => history.push("/shows/create")
                    } />
                <SearchShows setUserEntries={setUserEntries} userEntries={userEntries} />
            </div>
        </div>
    )
}