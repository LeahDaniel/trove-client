import React, { useState, useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { Alert, Button, Form, FormGroup, FormText, Input, Label } from "reactstrap"
import { BookRepo } from "../../repositories/BookRepo"
import { TagRepo } from "../../repositories/TagRepo"
import CreatableSelect from 'react-select/creatable'
import { SocialRepo } from "../../repositories/SocialRepo"

export const BookForm = () => {
    const history = useHistory()
    const { bookId } = useParams()
    const [presentBook, setPresentBook] = useState(null)
    const [tags, setTags] = useState([])
    const [firstAttempt, setFirstAttempt] = useState(true)
    const [alert, setAlert] = useState(false)
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        author: "",
        tagArray: []
    })
    const [invalid, setInvalid] = useState({
        name: true,
        current: true,
        author: true,
    })

    useEffect(
        () => {
            //on page load, GET streaming services and tags
            TagRepo.getAll().then(setTags)
        }, []
    )

    useEffect(() => {
        if (bookId) {
            SocialRepo.getCurrentUser()
                .then(currentUser => {
                    BookRepo.get(parseInt(bookId))
                        .then(book => {
                            if (book.tags) {
                                //change name, current, and multiplayer values based on presentBook values
                                const obj = {
                                    name: book.name,
                                    current: book.current,
                                    author: book.author.name,
                                    tagArray: []
                                }

                                //create a tag array from the book's associated taggedBooks, and set as userChoices.tagArray value
                                let tagArray = []
                                for (const tag of book.tags) {
                                    tagArray.push({ label: tag.tag, value: tag.id })
                                }
                                obj.tagArray = tagArray

                                //set user choices using the obj constructed above
                                setUserChoices(obj)
                            }

                            if (currentUser.id === book.user.id) {
                                setPresentBook(book)
                            }
                        })
                })
        }
    }, [bookId])

    useEffect(
        () => {
            //when userChoices change (as the user interacts with form), setInvalid state so that it is always up-to-date before form submit
            //use the userChoices values to set the invalid booleans (was the user entry a valid entry or not)

            const obj = {
                name: false,
                author: false,
                current: false
            }

            //name
            if (userChoices.name === "") {
                obj.name = true
            }
            //multiplayer
            if (userChoices.author === "") {
                obj.author = true
            }
            //current
            if (userChoices.current === null) {
                obj.current = true
            }

            setInvalid(obj)
        }, [userChoices]
    )


    const submitBook = (authorId) => {
        let tagIdArray = []
        let promiseArray = []

        for (const enteredTag of userChoices.tagArray) {
            if (enteredTag.__isNew__) {
                //post a new tag object with that enteredTag
                promiseArray.push(
                    TagRepo.addTag({ tag: enteredTag.value })
                        .then((res) => tagIdArray.push(res.id))
                )
            } else {
                tagIdArray.push(enteredTag.value)
            }
        }

        const bookFromUserChoices = {
            name: userChoices.name,
            current: userChoices.current,
            author: authorId,
            tags: tagIdArray,
        }

        Promise.all(promiseArray)
            .then(() => {
                if (presentBook) {
                    BookRepo.modifyBook(bookFromUserChoices, presentBook.id)
                } else {
                    BookRepo.addBook(bookFromUserChoices)
                }
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/books/current")
                } else {
                    history.push("/books/queue")
                }
            })
    }

    const constructAuthor = () => {
        BookRepo.getAuthorsByName(userChoices.author)
            .then(authors => {
                if (authors[0]) {
                    //set the state of the authorId using the id of the existing author object
                    submitBook(authors[0].id)
                } else {
                    //post a new author object with the entered author name
                    BookRepo.addAuthor({ name: userChoices.author })
                        .then((newAuthor) => {
                            submitBook(newAuthor.id)
                        })
                }
            })
    }


    return (
        <div className="row justify-content-center my-4">
            <Form className="my-4 p-5 col-9 gradient rounded border">
                {
                    presentBook
                        ? <h3> Edit a Book</h3>
                        : <h3> Add a New Book</h3>
                }
                <FormGroup className="mt-4">
                    <Label for="bookTitle">
                        Book Title
                    </Label>
                    <Input
                        id="bookTitle"
                        name="title"
                        //if this is not the first attempt at filling out the form, allow the 
                        //input to be marked as invalid (if the invalid state is true)
                        //Otherwise, do not mark field as invalid
                        invalid={!firstAttempt ? invalid.name : false}
                        //set value based on userChoices to allow form to pre-populate if user was pushed to form from edit button
                        //and so that the displayed entry changes as the user edits it (because of onChange)
                        value={userChoices.name}
                        //on change on field, set userChoices
                        onChange={(event) => {
                            const copy = { ...userChoices }
                            copy.name = event.target.value
                            setUserChoices(copy)
                        }}
                        className="mb-2"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Genre Tags</Label>
                    <CreatableSelect
                        isMulti
                        isClearable
                        value={userChoices.tagArray}
                        options={
                            tags.map(tag => ({ label: tag.tag, value: tag.id }))
                        }
                        onChange={optionChoices => {
                            const copy = { ...userChoices }
                            copy.tagArray = optionChoices
                            setUserChoices(copy)
                        }}
                        id="tagSelect"
                        placeholder="Select or create tags..."
                    />
                </FormGroup>
                {
                    presentBook?.tagArray?.length > 0
                        ? <Alert color="success" style={{ fontSize: 15 }} className="p-2 border rounded-0">The user who recommended this used the tags: {presentBook.tagArray.join(", ")}</Alert>
                        : ""
                }
                <FormGroup>
                    <Label for="exampleSelect">
                        Author
                    </Label>
                    <Input
                        id="bookTags"
                        type="text"
                        invalid={!firstAttempt ? invalid.author : false}
                        value={userChoices.author}
                        onChange={(event) => {
                            const copy = { ...userChoices }
                            copy.author = event.target.value
                            setUserChoices(copy)
                        }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="exampleSelect">
                        Current or Queued?
                    </Label>
                    <Input
                        id="currentSelect"
                        type="select"
                        invalid={!firstAttempt ? invalid.current : false}
                        value={userChoices.current === null
                            ? "Choose an option..."
                            : userChoices.current === true
                                ? "Current"
                                : "Queued"
                        }
                        onChange={(event) => {
                            const copy = { ...userChoices }

                            if (event.target.value === "Current") {
                                copy.current = true
                            } else if (event.target.value === "Queued") {
                                copy.current = false
                            } else {
                                copy.current = null
                            }
                            setUserChoices(copy)
                        }
                        }
                    >
                        <option>
                            Choose an option...
                        </option>
                        <option>
                            Current
                        </option>
                        <option>
                            Queued
                        </option>
                    </Input>
                    <FormText className="mb-2">
                        Have you started this book (current) or are you thinking of watching it in the future (queued)?
                    </FormText>
                </FormGroup>
                {
                    alert && presentBook
                        ?
                        <div>
                            <Alert
                                color="danger"
                            >
                                Please complete all required (!) fields. If you have no edits, click "Cancel".
                            </Alert>
                        </div>
                        : alert && !presentBook
                            ? <div>
                                <Alert
                                    color="danger"
                                >
                                    Please complete all required (!) fields before submitting.
                                </Alert>
                            </div>
                            : ""
                }
                <FormGroup>
                    <Button color="info" onClick={(evt) => {
                        evt.preventDefault()
                        // checkValidity()
                        setFirstAttempt(false)

                        if (Object.keys(invalid).every(key => invalid[key] === false)) {
                            constructAuthor()
                        } else {
                            setAlert(true)
                        }


                        //check if every key on the "invalid" object is false

                    }}>
                        Submit
                    </Button>
                    <Button onClick={() => { history.goBack() }} color="info" className="ms-3">
                        Cancel
                    </Button>
                </FormGroup>
            </Form >
        </div>
    )
}