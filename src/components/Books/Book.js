import React, { useState } from "react"
import { Badge, Card, CardBody, CardSubtitle, CardText, CardTitle, UncontrolledAlert } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';
import moveIcon from '../../images/MoveFolder3.png';
import sendIcon from '../../images/SendIcon.png';
import { useHistory } from "react-router";
import { RecommendationModal } from "../Social/RecommendationModal";


export const Book = ({ book, setBooks }) => {
    const history = useHistory()
    const [recommendationOpenBoolean, setRecommendationOpenBoolean] = useState(false)
    const [successOpenBoolean, setSuccessOpenBoolean] = useState(false)

    //delete book by id. If a current book, set books with current books, else set books with queued books (to update state appropriately based on current user view)
    const deleteBook = (bookId) => {
        if (book.current === true) {
            BookRepo.delete(bookId)
                .then(() => BookRepo.getAll(true)
                    .then(setBooks))
        } else {
            BookRepo.delete(bookId)
                .then(() => BookRepo.getAll(false)
                    .then(setBooks))
        }
    }

    //PUT operation to modify a book from queued to current (false to true). Called in button click.
    const addToCurrent = () => {
        BookRepo.modifyBook({
            name: book.name,
            current: true,
            authorId: book.authorId
        }, book.id)
            //after doing PUT operation, push user to the current list, where the book is now located
            .then(() => history.push("/books/current"))
    }

    return (
        <div className="mt-4">


            {/*
                Modal that pops up on send button click
            */}
            <RecommendationModal openBoolean={recommendationOpenBoolean} setOpenBoolean={setRecommendationOpenBoolean}
                book={book} setBookRecoSuccess={setSuccessOpenBoolean} />

            <Card
                body
                color="light"
                className="rounded shadow-sm border border-info"
            >
                {
                    setBooks
                        ?
                        <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-1">
                            {/* 
                                If the present book is in the queue, display a "Add to Current" button.
                            */}
                            {
                                book.current === false
                                    ? <button className="imgButton">
                                        <img src={moveIcon} alt="Move to Current" style={{ maxWidth: 40, maxHeight: 40 }} onClick={addToCurrent} />
                                    </button>
                                    : ""
                            }
                            {/* onClick of the edit button, push user to form route, and send along state of the book to the location */}
                            <button className="imgButton">
                                <img src={editIcon} alt="Edit" style={{ maxWidth: 35, maxHeight: 35 }} onClick={
                                    () => {
                                        history.push(`/books/${book.id}/edit`)
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
                            {/* onClick of delete button (trash icon) call deleteBook function with argument of the id of the present book. */}
                            <button className="imgButton">
                                <img src={deleteIcon} alt="Delete" style={{ maxWidth: 35, maxHeight: 35 }} onClick={() => deleteBook(book.id)} />
                            </button>

                        </div>
                        : ""
                }

                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4" className={setBooks ? "mb-3 mt-0" : "my-3 pt-3"}>
                        {/* display book names */}
                        {book.name}
                    </CardTitle>
                    <CardSubtitle className="my-3">
                        {/* display platforms (if current, display as "playing", else display as "available") */}
                        Written by {
                            book.author.name
                        }
                    </CardSubtitle>
                    <CardText className="my-3">
                        {/* map through the tags for the present book, and display the tag associated with each in a Badge format */}
                        {
                            book.tags?.map(tag => {
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