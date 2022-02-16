import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { ApplicationViews } from "./ApplicationViews";
import { NavBar } from "./nav/NavBar";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { SocialRepo } from "../repositories/SocialRepo";

export const Trove = () => {
    const [notification, setNotification] = useState(false)

    useEffect(() => {
        const findNotificationBoolean = () => {
            let notificationBool = false

            SocialRepo.gameRecommendationNotification()
                .then((response) => {
                    if (response.new === true) {
                        notificationBool = true
                    }
                })
                .then(SocialRepo.showRecommendationNotification)
                .then((response) => {
                    if (response.new === true) {
                        notificationBool = true
                    }
                })
                .then(SocialRepo.bookRecommendationNotification)
                .then((response) => {
                    if (response.new === true) {
                        notificationBool = true
                    }
                })
                .then(() => {
                    setNotification(notificationBool)
                })
        }

        if (localStorage.getItem("trove_token")) {
            findNotificationBoolean()
            const interval = setInterval(() => findNotificationBoolean(), 3000)
            return () => {
                clearInterval(interval);
            }
        }
    }, [])

    return (
        <>
            <Route
                render={() => {
                    // if there is a user logged in, show the navbar and app
                    if (localStorage.getItem("trove_token")) {
                        return (
                            <>
                                <NavBar notification={notification}/>
                                <ApplicationViews setNotification={setNotification}/>
                                <div className="bottom"></div>
                            </>
                        );
                        //otherwise show the login page
                    } else {
                        return <Redirect to="/login" />;
                    }
                }}
            />

            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
        </>
    )
};
