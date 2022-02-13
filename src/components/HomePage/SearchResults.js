import React from "react"
import { Game } from "../VideoGames/Game"
import { Show } from "../TVShows/Show"
import { Book } from "../Books/Book"

export const SearchResults = ({ games, books, shows, userAttemptedSearch, loadingGames, loadingShows, loadingBooks }) => {
    return (

        <article className="col-7">
            {
                books.length > 0 || games.length > 0 || shows.length > 0
                    ?
                    <>
                        {games.length > 0 ? <h3 className="mb-3 mt-4 ">Games</h3> : ""}
                        {loadingGames? "" : <div>{games.map(game => <Game key={game.id} game={game} />)}</div>}

                        {shows.length > 0 ? <h3 className="mb-3 mt-4 ">Shows</h3> : ""}
                        {loadingShows? "" : <div>{shows.map(show => <Show key={show.id} show={show} />)}</div>}

                        {books.length > 0 ? <h3 className="mb-3 mt-4 ">Books</h3> : ""}
                        {loadingBooks? "" : <div>{books.map(book => <Book key={book.id} book={book} />)}</div>}
                    </>
                    : <div className="pt-5 border-0 d-flex align-items-center justify-content-center">
                        <h5 className=" pt-5 text-center text-muted">
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