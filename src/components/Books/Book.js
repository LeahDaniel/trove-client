import React, { useEffect, useState } from "react"
import { Badge, Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import deleteIcon from '../../images/DeleteIcon.png';
import editIcon from '../../images/EditIcon.png';
import { useHistory } from "react-router";


export const Book = ({ book, setBooks }) => {
    const [presentBook, setBook] = useState([])
    const history = useHistory()

    //any time the book prop's id state changes (on page load) get individual book with expanded user, embedded taggedBooks (with embedded tags), and embedded bookPlatforms (with embedded platforms)
    useEffect(() => {
        BookRepo.get(book.id)
            .then(setBook)
    }, [book.id])

    //delete book by id. If a current book, set books with current books, else set books with queued books (to update state appropriately based on current user view)
    const deleteBook = (bookId) => {
        if (presentBook.current === true) {
            BookRepo.delete(bookId)
                .then(() => BookRepo.getAllCurrent()
                    .then(setBooks))
        } else {
            BookRepo.delete(bookId)
                .then(() => BookRepo.getAllQueue()
                    .then(setBooks))
        }
    }

    //PUT operation to modify a book from queued to current (false to true). Called in button click.
    const addToCurrent = () => {
        BookRepo.modifyBook({
            name: presentBook.name,
            userId: presentBook.userId,
            current: true,
            authorId: presentBook.authorId
        }, presentBook.id)
            //after doing PUT operation, push user to the current list, where the book is now located
            .then(() => history.push("/books/current"))
    }

    return (
        <div className="mt-5">
            <Card
                body
                color="light"
            >
                {
                    setBooks
                        ?
                        <div style={{ alignSelf: "flex-end" }} className="mt-2 mb-0">
                            {/* onClick of delete button (trash icon) call deleteBook function with argument of the id of the present book. */}
                            <img className="me-3" src={deleteIcon} alt="Delete" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                                () => { return deleteBook(presentBook.id) }
                            } />
                            {/* onClick of the edit button, push user to form route, and send along state of the presentBook to the location */}
                            <img className="me-1" src={editIcon} alt="Edit" style={{ maxWidth: 30, maxHeight: 30 }} onClick={
                                () => {
                                    history.push({
                                        pathname: "/books/create",
                                        state: presentBook
                                    })
                                }
                            } />
                        </div>
                        : ""
                }

                <CardBody className="mt-0 pt-0">
                    <CardTitle tag="h4" className={setBooks? "mb-3 mt-0" :  "my-3 pt-3"}>
                        {/* display book names */}
                        {presentBook.name}
                    </CardTitle>
                    <CardSubtitle className="my-3">
                        {/* display platforms (if current, display as "playing", else display as "available") */}
                        Written by: {
                            presentBook.author?.name
                        }
                    </CardSubtitle>
                    <CardText className="my-3">
                        {/* map through the taggedBooks for the present book, and display the tag associated with each in a Badge format */}
                        {
                            presentBook.taggedBooks?.map(taggedBook => {
                                return <Badge className="my-1 me-1" key={taggedBook.id} style={{ fontSize: 15 }} color="info" pill>
                                    {taggedBook.tag?.tag}
                                </Badge>
                            })
                        }
                    </CardText>
                    {/* 
                        If the present book is in the queue, display a "Add to Current" button.
                        If the present book has more than one book platform, display a modal that allows the user
                        to select one platform, then call the addToCurrent function on the modal. 
                        If the present book has only one platform, call the addToCurrent function on this button.
                    */}
                    {
                        presentBook.current === false && setBooks
                            ? <Button onClick={addToCurrent}> Add to Current </Button>
                            : ""
                    }
                </CardBody>
            </Card>
        </div>

    )
}