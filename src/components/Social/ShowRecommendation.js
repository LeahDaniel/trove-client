import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import deleteIcon from '../../images/DeleteIcon.png';
import { useHistory } from "react-router";
import { SocialRepo } from "../../repositories/SocialRepo";
import { ShowRepo } from "../../repositories/ShowRepo";


export const ShowRecommendation = ({ showRecommendation, setShowRecommendations }) => {
    const history = useHistory()
    const [show, setShow] = useState([])

    useEffect(
        () => {
            ShowRepo.get(showRecommendation.show.id)
                .then(setShow)
        }, [showRecommendation]
    )

    //delete recommendation by id. If a current show, set shows with current shows, else set shows with queued shows (to update state appropriately based on current user view)
    const deleteRecommendation = (id) => {
        SocialRepo.deleteShowRecommendation(id)
            .then(SocialRepo.getAllShowRecommendations)
            .then(setShowRecommendations)
    }

    return (
        <div className="mt-4">
            <Card
                body
                color="light"
                className="rounded shadow border-0"
            >
                <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                    {/* onClick of delete button (trash icon) call deleteRecommendation function with argument of the id of the present show. */}
                    <button className="imgButton">
                        <img src={deleteIcon} alt="Delete" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                            () => deleteRecommendation(showRecommendation.id)
                        } />
                    </button>
                </div>

                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4" className="mb-3 mt-0">
                        {/* display recommendation names */}
                        {show.name}
                    </CardTitle>
                    <CardSubtitle className="mb-3 mt-0">
                        {/* display sender name */}
                        <em>Recommended by {showRecommendation.sender.username}</em>
                    </CardSubtitle>
                    <CardText className="mb-3 ">
                        {/* display message (shows as empty string if not entered on modal) */}
                        {showRecommendation.message}
                    </CardText>

                    <Button color="info" onClick={() => {
                        history.push(`/shows/${show.id}/edit`)
                    }}> Add to Queue </Button>

                </CardBody>
            </Card>

        </div>

    )
}