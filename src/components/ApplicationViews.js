import React, { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { SocialRepo } from "../repositories/SocialRepo"
import { BookForm } from "./Books/BookForm"
import { BookQueueView } from "./Books/BookQueueView"
import { CurrentBooksView } from "./Books/CurrentBooksView"
import { HomePage } from "./HomePage/HomePage"
import { RecommendationList } from "./Social/RecommendationList"
import { TagView } from "./Tags/TagView"
import { CurrentShowsView } from "./TVShows/CurrentShowsView"
import { ShowForm } from "./TVShows/ShowForm"
import { ShowQueueView } from "./TVShows/ShowQueueView"
import { CurrentGamesView } from "./VideoGames/CurrentGamesView"
import { GameForm } from "./VideoGames/GameForm"
import { GameQueueView } from "./VideoGames/GameQueueView"


export const ApplicationViews = ({ setNewNotification }) => {
    const [receivedBookRecommendations, setReceivedBookRecommendations] = useState([])
    const [receivedGameRecommendations, setReceivedGameRecommendations] = useState([])
    const [receivedShowRecommendations, setReceivedShowRecommendations] = useState([])

    useEffect(
        () => {
            SocialRepo.getAllShowRecommendations()
                .then(setReceivedShowRecommendations)
            SocialRepo.getAllGameRecommendations()
                .then(setReceivedGameRecommendations)
            SocialRepo.getAllBookRecommendations()
                .then(setReceivedBookRecommendations)
        }, []
    )

    useEffect(
        () => {
            const foundBookRecommendation = receivedBookRecommendations.find(bookReco => bookReco.read === false)
            const foundGameRecommendation = receivedGameRecommendations.find(gameReco => gameReco.read === false)
            const foundShowRecommendation = receivedShowRecommendations.find(showReco => showReco.read === false)
            if (foundBookRecommendation || foundGameRecommendation || foundShowRecommendation) {
                setNewNotification(true)
            } else {
                setNewNotification(false)
            }
        }, [receivedBookRecommendations, receivedGameRecommendations, receivedShowRecommendations, setNewNotification]
    )
    return (
        <>
            <Route exact path="/">
                <HomePage />
            </Route>
            <Route exact path="/games/current">
                <CurrentGamesView />
            </Route>
            <Route exact path="/games/create">
                <GameForm />
            </Route>
            <Route exact path="/games/:gameId(\d+)/edit">
                <GameForm />
            </Route>
            <Route exact path="/games/queue">
                <GameQueueView />
            </Route>
            <Route exact path="/shows/current">
                <CurrentShowsView />
            </Route>
            <Route exact path="/shows/create">
                <ShowForm />
            </Route>
            <Route exact path="/shows/:showId(\d+)/edit">
                <ShowForm />
            </Route>
            <Route exact path="/shows/queue">
                <ShowQueueView />
            </Route>
            <Route exact path="/books/current">
                <CurrentBooksView />
            </Route>
            <Route exact path="/books/create">
                <BookForm />
            </Route>
            <Route exact path="/books/:bookId(\d+)/edit">
                <BookForm />
            </Route>
            <Route exact path="/books/queue">
                <BookQueueView />
            </Route>
            <Route exact path="/tags">
                <TagView />
            </Route>
            <Route exact path="/recommendations">
                <RecommendationList setNewNotification={setNewNotification}/>
            </Route>
        </>
    )
}