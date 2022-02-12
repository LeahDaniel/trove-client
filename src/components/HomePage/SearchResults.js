import React from "react"
import { Game } from "../VideoGames/Game"
import { Show } from "../TVShows/Show"
import { Book } from "../Books/Book"

export const SearchResults = ({ games, books, shows, userAttemptedSearch }) => {
    return (

        <article className="col-7">
            {
                books.length > 0 || games.length > 0 || shows.length > 0
                    ?
                    <>
                        {games.length > 0 ? <h3 className="mt-5 ">Games</h3> : ""}
                        <div>{games.map(game => <Game key={game.id} game={game} />)}</div>

                        {shows.length > 0 ? <h3 className="mt-5 ">Shows</h3> : ""}
                        <div>{shows.map(show => <Show key={show.id} show={show} />)}</div>

                        {books.length > 0 ? <h3 className="mt-5 ">Books</h3> : ""}
                        <div>{books.map(book => <Book key={book.id} book={book} />)}</div>
                    </>
                    : <div className="mt-5 pt-5 border-0 d-flex align-items-center justify-content-center">
                        <h5 className=" pt-5 mt-5 text-center text-muted">
                            {
                                userAttemptedSearch
                                    ? "No Results Found"
                                    : "Your list is empty. Select 'Create New' under a media type in the navbar to add items."
                            }
                        </h5>
                    </div>
            }

        </article>

    )

}