import { fetchIt } from "./FetchIt"


export const SocialRepo = {
    //GETs
    async getUserByUsername(username) {
        return await fetchIt(`https://trove-server.herokuapp.com/users?username=${username}`)
    },
    async getCurrentUser() {
        return fetch("https://trove-server.herokuapp.com/users", {
        method: "GET",
        headers: {
            "Authorization": `Token ${localStorage.getItem("trove_token")}`
        }
    })
        .then(response => response.json())
    },

    async getAllGameRecommendations() {
        return await fetchIt(`https://trove-server.herokuapp.com/gameRecommendations`)
    },
    async getAllShowRecommendations() {
        return await fetchIt(`https://trove-server.herokuapp.com/showRecommendations`)
    },
    async getAllBookRecommendations() {
        return await fetchIt(`https://trove-server.herokuapp.com/bookRecommendations`)
    },
    async bookRecommendationNotification() {
        return await fetchIt(`https://trove-server.herokuapp.com/bookRecommendations/notify`)
    },
    async showRecommendationNotification() {
        return await fetchIt(`https://trove-server.herokuapp.com/showRecommendations/notify`)
    },
    async gameRecommendationNotification() {
        return await fetchIt(`https://trove-server.herokuapp.com/gameRecommendations/notify`)
    },



    //DELETEs
    async deleteGameRecommendation(id) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/gameRecommendations/${id}`,
            "DELETE"
        )
    },
    async deleteShowRecommendation(id) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/showRecommendations/${id}`,
            "DELETE"
        )
    },
    async deleteBookRecommendation(id) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/bookRecommendations/${id}`,
            "DELETE"
        )
    },

    //POSTs
    async addBookRecommendation(newRecommendation) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/bookRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    async addShowRecommendation(newRecommendation) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/showRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    async addGameRecommendation(newRecommendation) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/gameRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    //PUTs (These will change the "read" boolean to true on the server side for 
    // all of the user's recommendations)
    async readBookRecommendations() {
        return await fetchIt(
            `https://trove-server.herokuapp.com/bookRecommendations/read`,
            "PUT"
        )
    },
    async readShowRecommendations() {
        return await fetchIt(
            `https://trove-server.herokuapp.com/showRecommendations/read`,
            "PUT"
        )
    },
    async readGameRecommendations() {
        return await fetchIt(
            `https://trove-server.herokuapp.com/gameRecommendations/read`,
            "PUT"
        )
    },
}

