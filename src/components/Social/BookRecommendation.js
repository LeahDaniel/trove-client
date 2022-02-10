import React from "react"
import { useHistory } from "react-router";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import deleteIcon from '../../images/DeleteIcon.png';
import { SocialRepo } from "../../repositories/SocialRepo";


export const BookRecommendation = ({ bookRecommendation, setBookRecommendations }) => {
    const history = useHistory()

    //delete recommendation by id. If a current book, set books with current books, else set books with queued books (to update state appropriately based on current user view)
    const deleteRecommendation = (id) => {
        SocialRepo.deleteBookRecommendation(id)
            .then(SocialRepo.getAllBookRecommendations)
            .then(setBookRecommendations)
    }

    return (
        <div className="mt-4">
            <Card
                body
                color="light"
                className="rounded shadow border-0"
            >
                <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                    {/* onClick of delete button (trash icon) call deleteRecommendation function with argument of the id of the present book. */}
                    <button className="imgButton">
                        <img src={deleteIcon} alt="Delete" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                            () => deleteRecommendation(bookRecommendation.id)
                        } />
                    </button>
                </div>

                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4" className="mb-3 mt-0">
                        {/* display recommendation names */}
                        {bookRecommendation.book.name}
                    </CardTitle>
                    <CardSubtitle className="mb-3 mt-0">
                        {/* display sender name */}
                        <em>Recommended by {bookRecommendation.sender.username}</em>
                    </CardSubtitle>
                    <CardText className="my-3">
                        {/* display message (books as empty string if not entered on modal) */}
                        {bookRecommendation.message}
                    </CardText>

                    <Button color="info" onClick={() => {
                        history.push(`/books/${bookRecommendation.book.id}/edit`)
                    }}> Add to Queue </Button>

                </CardBody>
            </Card>
        </div>
    )
}