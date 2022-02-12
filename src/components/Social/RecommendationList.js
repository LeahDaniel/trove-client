import React, { useEffect, useState } from "react"
import { SocialRepo } from "../../repositories/SocialRepo"
import { BookRecommendation } from "./BookRecommendation"
import { GameRecommendation } from "./GameRecommendation"
import { ShowRecommendation } from "./ShowRecommendation"

export const RecommendationList = ({ setNewNotification }) => {
    const [gameRecommendations, setGameRecommendations] = useState([])
    const [showRecommendations, setShowRecommendations] = useState([])
    const [bookRecommendations, setBookRecommendations] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(
        () => {
            SocialRepo.getAllGameRecommendations().then(setGameRecommendations)
                .then(SocialRepo.readGameRecommendations)
                .then(() => SocialRepo.getAllBookRecommendations().then(setBookRecommendations)
                    .then(SocialRepo.readBookRecommendations))
                .then(() => SocialRepo.getAllShowRecommendations().then(setShowRecommendations)
                    .then(SocialRepo.readShowRecommendations))
                .then(() => {
                    setLoading(false)
                    setNewNotification(false)
                })
        }, []
    )

    return (
        <div className="row justify-content-center mt-5">
            {
                isLoading
                    ? <div className="col-9"> </div>
                    : <div className="col-9">
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
            }

        </div>
    )
}