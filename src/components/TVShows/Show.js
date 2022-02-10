import React, { useState } from "react"
import { Badge, Card, CardBody, CardText, CardTitle, UncontrolledAlert } from "reactstrap"
import { ShowRepo } from "../../repositories/ShowRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';
import moveIcon from '../../images/MoveFolder3.png';
import sendIcon from '../../images/SendIcon.png';
import { useHistory } from "react-router";
import { RecommendationModal } from "../Social/RecommendationModal";


export const Show = ({ show, setShows }) => {
    const history = useHistory()
    const [successOpenBoolean, setSuccessOpenBoolean] = useState(false)
    const [recommendationOpenBoolean, setRecommendationOpenBoolean] = useState(false)


    //delete show by id. If a current show, set shows with current shows, else set shows with queued shows (to update state appropriately based on current user view)
    const deleteShow = (showId) => {
        if (show.current === true) {
            ShowRepo.delete(showId)
                .then(() => ShowRepo.getAll(true)
                    .then(setShows))
        } else {
            ShowRepo.delete(showId)
                .then(() => ShowRepo.getAll(false)
                    .then(setShows))
        }
    }

    //PUT operation to modify a show from queued to current (false to true). Called in button click.
    const addToCurrent = () => {
        ShowRepo.modifyShow({
            name: show.name,
            current: true,
            streaming_service: show.streamingServiceId
        }, show.id)
            //after doing PUT operation, push user to the current list, where the show is now located
            .then(() => history.push("/shows/current"))
    }

    return (
        <div className="mt-4">
            <RecommendationModal openBoolean={recommendationOpenBoolean} setOpenBoolean={setRecommendationOpenBoolean}
                show={show} setShowRecoSuccess={setSuccessOpenBoolean} />
            <Card
                body
                color="light"
                className="rounded shadow-sm border border-info"
            >
                {
                    setShows
                        ?
                        <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-1">
                            {/* 
                                If the present show is in the queue, display a "Add to Current" button.
                            */}
                            {
                                show.current === false
                                    ? <button className="imgButton">
                                        <img src={moveIcon} alt="Move to Current" style={{ maxWidth: 40, maxHeight: 40 }} onClick={addToCurrent} />
                                    </button>
                                    : ""
                            }
                            {/* onClick of the edit button, push user to form route, and send along state of the show to the location */}
                            <button className="imgButton">
                                <img src={editIcon} alt="Edit" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => {
                                        history.push(`/shows/${show.id}/edit`)
                                    }
                                } />
                            </button>
                            <button className="imgButton">
                                <img src={sendIcon} alt="Send" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => setRecommendationOpenBoolean(true)
                                } />
                            </button>
                            {/* onClick of delete button (trash icon) call deleteShow function with argument of the id of the present show. */}
                            <button className="imgButton">
                                <img src={deleteIcon} alt="Delete" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => deleteShow(show.id)
                                } />
                            </button>

                        </div>
                        : ""
                }

                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4" className={setShows ? "mb-3 mt-0" : "my-3 pt-3"}>
                        {/* display show names */}
                        {show.name}
                    </CardTitle>
                    <CardText className="my-3">
                        {/* display platforms (if current, display as "playing", else display as "available") */}
                        {show.current ? "Watching" : "Available"} on {
                            show.streaming_service.service
                        }
                    </CardText>
                    <CardText className="my-3">
                        {/* map through the tags for the present show, and display the tag associated with each in a Badge format */}
                        {
                            show.tags?.map(tag => {
                                return <Badge className="my-1 me-1 shadow-sm" key={tag.id} style={{ fontSize: 15, fontWeight: 600 }} color="tags" pill>
                                    {tag.tag}
                                </Badge>
                            })
                        }
                    </CardText>
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