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
    const [loadingList, setLoadingList] = useState(false)
    const [userEntries, setUserEntries] = useState({
        title: "",
        tags: new Set()
    })


    useEffect(
        () => {
            const tagsExist = userEntries.tags.size > 0
            const titleExists = userEntries.title !== ""

            let filters = {
                title: "",
                current: "",
                tagArray: null
            }

            if (titleExists) filters.titleSearch = userEntries.title
            if (tagsExist) filters.tagArray = Array.from(userEntries.tags)

            let promiseArray = []

            promiseArray.push(GameRepo.getAll(filters.tagArray, filters.titleSearch, filters.current).then(setGames))
            promiseArray.push(ShowRepo.getAll(filters.tagArray, filters.titleSearch, filters.current).then(setShows))
            promiseArray.push(BookRepo.getAll(filters.tagArray, filters.titleSearch, filters.current).then(setBooks))

            // setLoadingList(true)

            Promise.all(promiseArray)
                .then(() => setIsLoading(false))
                // .then(() => setLoadingList(false))
                
            //mark whether a user has used the filters in order to determine the message they get for a blank list
            if (titleExists || tagsExist) {
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
                                {
                                    loadingList
                                        ? <div className="col-7"></div>
                                        : <SearchResults games={games} books={books} 
                                            shows={shows} userAttemptedSearch={userAttemptedSearch} />
                                }
                            </div>
                        </div>
                    </>
            }
        </>
    )

}
