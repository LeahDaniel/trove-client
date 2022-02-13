import React, { useEffect, useState } from 'react';
import { GameRepo } from "../../repositories/GameRepo"
import { ShowRepo } from "../../repositories/ShowRepo"
import { BookRepo } from "../../repositories/BookRepo"
import { FilterForm } from './FilterForm';
import { SearchResults } from './SearchResults';

export const HomePage = () => {
    const [games, setGames] = useState([])
    const [books, setBooks] = useState([])
    const [shows, setShows] = useState([])
    const [userAttemptedSearch, setAttemptBoolean] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadingGames, setLoadingGames] = useState(true)
    const [loadingShows, setLoadingShows] = useState(true)
    const [loadingBooks, setLoadingBooks] = useState(true)
    const [userEntries, setUserEntries] = useState({
        title: "",
        current: "",
        tags: new Set()
    })


    useEffect(
        () => {
            const tagsExist = userEntries.tags.size > 0
            const titleExists = userEntries.title !== ""
            const currentExists = userEntries.current !== ""

            let filters = {
                title: "",
                current: "",
                tagArray: null
            }

            if (titleExists) filters.title = userEntries.title
            if (currentExists) filters.current = userEntries.current
            if (tagsExist) filters.tagArray = Array.from(userEntries.tags)

            let promiseArray = []

            promiseArray.push(
                GameRepo.getAll(filters.current, filters.tagArray, filters.title).then(setGames).then(() => setLoadingGames(false)))
            promiseArray.push(
                ShowRepo.getAll(filters.current, filters.tagArray, filters.title).then(setShows).then(() => setLoadingShows(false)))
            promiseArray.push(
                BookRepo.getAll(filters.current, filters.tagArray, filters.title).then(setBooks).then(() => setLoadingBooks(false)))


            Promise.all(promiseArray)
                .then(() => setIsLoading(false))

            //mark whether a user has used the filters in order to determine the message they get for a blank list
            if (titleExists || tagsExist || currentExists) {
                setAttemptBoolean(true)
            } else {
                setAttemptBoolean(false)
            }

        }, [userEntries]
    )

    return (
        <>
            {
                isLoading
                    ? ""
                    : <>
                        <div className="p-5 m-5 gradient border-0 shadow-sm" style={{ borderRadius: 25 }}>
                            <p>Welcome! Please use the navigation bar above to find the list of media you'd like to look through, or use the filter feature below to search through all of your media at once.</p>
                            <p className="pt-3">Each media type has a:</p>
                            <ul>
                                <li>Current List (for media you are currently watching/playing/etc)</li>
                                <li>Queue (for media you've been recommended or want to watch/play/etc in the future)</li>
                                <li>Option to add a new entry</li>
                            </ul>
                        </div>
                        <div>
                            {/* <div className="row justify-content-center mt-4"><h2 className='col-6 text-center'>Your Media</h2></div> */}
                            <div className="row justify-content-evenly">
                                <FilterForm userEntries={userEntries} setUserEntries={setUserEntries} />
                                <SearchResults games={games} books={books} shows={shows} 
                                userAttemptedSearch={userAttemptedSearch} loadingBooks={loadingBooks} 
                                loadingGames={loadingGames} loadingShows={loadingShows}/>
                            </div>
                        </div>
                    </>
            }
        </>
    )

}
