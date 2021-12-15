import React, { useEffect, useState } from "react"
import { Game } from "../VideoGames/Game"
import { Show } from "../TVShows/Show"
import { Book } from "../Books/Book"
import { Card, CardBody, CardTitle } from "reactstrap"

export const SearchResults = ({ games, shows, books, userAttemptedSearch }) => {
    const [currentGames, setCurrentGames] = useState([])
    const [queuedGames, setQueuedGames] = useState([])
    const [currentShows, setCurrentShows] = useState([])
    const [queuedShows, setQueuedShows] = useState([])
    const [currentBooks, setCurrentBooks] = useState([])
    const [queuedBooks, setQueuedBooks] = useState([])

    useEffect(
        () => {
            setCurrentGames(games.filter(game => game.current === true))
            setQueuedGames(games.filter(game => game.current === false))
            setCurrentShows(shows.filter(show => show.current === true))
            setQueuedShows(shows.filter(show => show.current === false))
            setCurrentBooks(books.filter(book => book.current === true))
            setQueuedBooks(books.filter(book => book.current === false))
        },
        [games, shows, books]
    )

    return (

        <article>
            {
                games.length > 0 || shows.length > 0 || books.length > 0
                    ?
                    <>
                        <div>
                            {
                                currentGames.length > 0
                                    ?
                                    <>
                                        <h3 className="mt-5">Current Games</h3>
                                        <div>{currentGames.map(game => <Game key={game.id} game={game} />)}</div>
                                    </>
                                    : ""
                            }
                            {
                                queuedGames.length > 0
                                    ?
                                    <>
                                        <h3 className="mt-5">Queued Games</h3>
                                        <div>{queuedGames.map(game => <Game key={game.id} game={game} />)}</div>
                                    </>
                                    : ""
                            }
                        </div>
                        <div>
                            {
                                currentShows.length > 0
                                    ?
                                    <>
                                        <h3 className="mt-5">Current Shows</h3>
                                        <div>{currentShows.map(show => <Show key={show.id} show={show} />)}</div>
                                    </>
                                    : ""
                            }
                            {
                                queuedShows.length > 0
                                    ?
                                    <>
                                        <h3 className="mt-5">Queued Shows</h3>
                                        <div>{queuedShows.map(show => <Show key={show.id} show={show} />)}</div>
                                    </>
                                    : ""
                            }
                        </div>
                        <div>
                            {
                                currentBooks.length > 0
                                    ?
                                    <>
                                        <h3 className="mt-5">Current Books</h3>
                                        <div>{currentBooks.map(book => <Book key={book.id} book={book} />)}</div>
                                    </>
                                    : ""
                            }
                            {
                                queuedBooks.length > 0
                                    ?
                                    <>
                                        <h3 className="mt-5">Queued Books</h3>
                                        <div>{queuedBooks.map(book => <Book key={book.id} book={book} />)}</div>
                                    </>
                                    : ""
                            }
                        </div>
                    </>
                    : <Card
                        body
                    >
                        <CardBody className="d-flex align-items-center justify-content-center">
                            <CardTitle tag="h6" className="text-center text-muted">
                                {
                                    userAttemptedSearch
                                        ? "No Results Found"
                                        : "Your list is empty. Choose 'Create New' from one of the dropdown items in the navigation bar to begin."
                                }
                            </CardTitle>
                        </CardBody>
                    </Card>
            }

        </article>

    )

}