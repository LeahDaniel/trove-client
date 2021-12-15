import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import { GameRepo } from "../../repositories/GameRepo"
import { ShowRepo } from "../../repositories/ShowRepo"
import { BookRepo } from "../../repositories/BookRepo"
import { FilterForm } from './FilterForm';
import { SearchResults } from './SearchResults';

export const HomePage = () => {
    const history = useHistory()
    const [userEntries, setUserEntries] = useState({
        title: "",
        tags: new Set()
    })
    const [games, setGames] = useState([])
    const [books, setBooks] = useState([])
    const [shows, setShows] = useState([])
    const [midFilterGames, setFilteredGames] = useState([])
    const [midFilterShows, setFilteredShows] = useState([])
    const [midFilterBooks, setFilteredBooks] = useState([])


    useEffect(
        () => {
            GameRepo.getAll()
                .then(setGames)
                .then(ShowRepo.getAll)
                .then(setShows)
                .then(BookRepo.getAll)
                .then(setBooks)
        }, []
    )

    useEffect(
        () => {
            const [gamesArray, showsArray, booksArray] = determineFilters()
            setGames(gamesArray)
            setShows(showsArray)
            setBooks(booksArray)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [midFilterGames, midFilterBooks, midFilterShows]
    )

    useEffect(
        () => {
            if (userEntries.title === "") {
                GameRepo.getAll()
                    .then(setFilteredGames)
                    .then(ShowRepo.getAll)
                    .then(setFilteredShows)
                    .then(BookRepo.getAll)
                    .then(setFilteredBooks)
            } else {
                GameRepo.getAllBySearchTerm(userEntries.title)
                    .then(setFilteredGames)
                ShowRepo.getAllBySearchTerm(userEntries.title)
                    .then(setFilteredShows)
                BookRepo.getAllBySearchTerm(userEntries.title)
                    .then(setFilteredBooks)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [userEntries]
    )

    const determineFilters = () => {
        const tagsExist = userEntries.tags.size > 0
        const noTags = userEntries.tags.size === 0

        if (tagsExist) {
            let newGameArray = []
            let newShowArray = []
            let newBookArray = []
            
            for (const game of midFilterGames){
                let booleanArray = []
                userEntries.tags.forEach(tagId => {
                    booleanArray.push(game.taggedGames?.find(taggedGame => taggedGame.tagId === tagId))
                })
                if (booleanArray.every(boolean => boolean === true)) {
                    newGameArray.push(game)
                }
            }
            for (const show of midFilterShows){
                let booleanArray = []
                userEntries.tags.forEach(tagId => {
                    booleanArray.push(show.taggedShows?.find(taggedShow => taggedShow.tagId === tagId))
                })
                if (booleanArray.every(boolean => boolean === true)) {
                    newShowArray.push(show)
                }
            }
            for (const book of midFilterBooks){
                let booleanArray = []
                userEntries.tags.forEach(tagId => {
                    booleanArray.push(book.taggedBooks?.find(taggedBook => taggedBook.tagId === tagId))
                })
                if (booleanArray.every(boolean => boolean === true)) {
                    newBookArray.push(book)
                }
            }

            return [newGameArray, newShowArray, newBookArray]

        } else if (noTags) {

            return [midFilterGames, midFilterShows, midFilterBooks]

        }
    }

    return (
        <>
            <div className="pt-5 mx-4">
                <p>Please use the navigation bar above to find the list of media you'd like to look through.</p>
                <p className="pt-3">Each media type has a:</p>
                <ul>
                    <li>Current List (for media you are currently watching/playing/etc)</li>
                    <li>Queue (for media you've been recommended or want to watch/play/etc in the future)</li>
                    <li>Option to add a new entry</li>
                </ul>
            </div>
            <div>
                <FilterForm userEntries={userEntries} setUserEntries={setUserEntries} />
                <SearchResults games={games} shows={shows} books={books} />
            </div>
        </>
    )
}
