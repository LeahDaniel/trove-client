import React, { useEffect, useState } from "react"
import { SocialRepo } from "../../repositories/SocialRepo"
import { BookRecommendation } from "./BookRecommendation"
import { GameRecommendation } from "./GameRecommendation"
import { ShowRecommendation } from "./ShowRecommendation"

export const RecommendationList = ({ setNewNotification }) => {
    const [gameRecommendations, setGameRecommendations] = useState([])
    const [showRecommendations, setShowRecommendations] = useState([])
    const [bookRecommendations, setBookRecommendations] = useState([])

    useEffect(
        () => {
            SocialRepo.getAllGameRecommendations().then(setGameRecommendations)
            SocialRepo.getAllBookRecommendations().then(setBookRecommendations)
            SocialRepo.getAllShowRecommendations().then(setShowRecommendations)
            setNewNotification(false)
        }, []
    )

    useEffect(
        () => {
            //Mark recommendations as read once the page is done loading, 
            //in order to control notifications
            let promiseArray = []

            for (const gameReco of gameRecommendations) {
                promiseArray.push(SocialRepo.modifyGameRecommendation(gameReco.id))
            }
            for (const showReco of showRecommendations) {
                promiseArray.push(SocialRepo.modifyShowRecommendation(showReco.id))
            }
            for (const bookReco of bookRecommendations) {
                promiseArray.push(SocialRepo.modifyBookRecommendation(bookReco.id))
            }
            Promise.all(promiseArray)
        }, [gameRecommendations, bookRecommendations, showRecommendations]
    )

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-9">
                {/* Full list of recommendation cards. Pass state of recommendation and the setter function to the individual recommendation card component */}
                {
                    gameRecommendations.length > 0 || showRecommendations.length > 0 || bookRecommendations.length > 0
                        ? <div>

                            {gameRecommendations.map(recommendation => <GameRecommendation key={recommendation.id} gameRecommendation={recommendation} setGameRecommendations={setGameRecommendations} />)}
                            {showRecommendations.map(recommendation => <ShowRecommendation key={recommendation.id} showRecommendation={recommendation} setShowRecommendations={setShowRecommendations} />)}
                            {bookRecommendations.map(recommendation => <BookRecommendation key={recommendation.id} bookRecommendation={recommendation} setBookRecommendations={setBookRecommendations} />)}
                        
                        </div>
                        : <div
                            className="mt-5 pt-5 border-0 d-flex align-items-center justify-content-center"
                        >
                            <h5 className="mt-5 pt-5 text-center text-muted">
                                No Recommendations
                            </h5>
                        </div>
                }
            </div>
        </div>
    )
}