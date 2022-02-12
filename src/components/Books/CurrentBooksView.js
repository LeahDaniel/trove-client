import React, { useEffect, useState } from "react"
import { BookList } from "./BookList"
import { SearchBooks } from "./SearchBooks"
import addIcon from '../../images/AddIcon.png';
import { useHistory } from "react-router";
import { BookRepo } from "../../repositories/BookRepo";
import { Button, Card } from "reactstrap";

export const CurrentBooksView = () => {
    const history = useHistory()
    const [books, setBooks] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [userEntries, setUserEntries] = useState({
        name: "",
        author: "0",
        tags: new Set()
    })

    useEffect(
        () => {
            //variables for whether or not the user has filled in each filter
            const authorExist = userEntries.author !== "0"
            const nameExist = userEntries.name !== ""
            const tagsExist = userEntries.tags.size > 0

            let filters = {
                current: "True",
                nameSearch: "",
                authorId: "",
                tagArray: null
            }

            if(authorExist) filters.authorId = userEntries.author
            if(nameExist) filters.nameSearch = userEntries.name
            if(tagsExist) filters.tagArray = Array.from(userEntries.tags)

            if (nameExist || authorExist || tagsExist) {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }

            setLoading(true)
            BookRepo.getAll(filters.tagArray, filters.nameSearch, filters.current, filters.authorId)
                .then(setBooks)
                .then(() => setLoading(false))

        }, [userEntries]
    )

    return (
        <div className="row justify-content-evenly">
            <div className="col-3">
                {/* clickable "add" image to bring user to form */}
                <div className="row justify-content-center mt-5">
                    <Button color="info" size="sm" className="col-sm-10 col-md-8 col-lg-6" onClick={
                        () => history.push("/books/create")
                    }>
                        <img src={addIcon} alt="Add" style={{ maxWidth: 25 }} className="me-2"
                        />
                        Add Book
                    </Button>
                </div>

                <SearchBooks setUserEntries={setUserEntries} userEntries={userEntries} />
            </div>
            {
                isLoading
                    ? < Card className="col-7 d-flex align-items-center justify-content-center border-0" />
                    : <BookList books={books} setBooks={setBooks} userAttemptedSearch={userAttemptedSearch} />
            }

        </div>
    )
}