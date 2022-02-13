import { fetchIt } from "./FetchIt"


export const SocialRepo = {
    //GETs
    async getUserByUsername(username) {
        return await fetchIt(`http://localhost:8000/users?username=${username}`)
    },
    async getCurrentUser() {
        return fetch("http://localhost:8000/users", {
        method: "GET",
        headers: {
            "Authorization": `Token ${localStorage.getItem("trove_token")}`
        }
    })
        .then(response => response.json())
    },

    async getAllGameRecommendations() {
        return await fetchIt(`http://localhost:8000/gameRecommendations`)
    },
    async getAllShowRecommendations() {
        return await fetchIt(`http://localhost:8000/showRecommendations`)
    },
    async getAllBookRecommendations() {
        return await fetchIt(`http://localhost:8000/bookRecommendations`)
    },
    async bookRecommendationNotification() {
        return await fetchIt(`http://localhost:8000/bookRecommendations/notify`)
    },
    async showRecommendationNotification() {
        return await fetchIt(`http://localhost:8000/showRecommendations/notify`)
    },
    async gameRecommendationNotification() {
        return await fetchIt(`http://localhost:8000/gameRecommendations/notify`)
    },



    //DELETEs
    async deleteGameRecommendation(id) {
        return await fetchIt(
            `http://localhost:8000/gameRecommendations/${id}`,
            "DELETE"
        )
    },
    async deleteShowRecommendation(id) {
        return await fetchIt(
            `http://localhost:8000/showRecommendations/${id}`,
            "DELETE"
        )
    },
    async deleteBookRecommendation(id) {
        return await fetchIt(
            `http://localhost:8000/bookRecommendations/${id}`,
            "DELETE"
        )
    },

    //POSTs
    async addBookRecommendation(newRecommendation) {
        return await fetchIt(
            `http://localhost:8000/bookRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    async addShowRecommendation(newRecommendation) {
        return await fetchIt(
            `http://localhost:8000/showRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    async addGameRecommendation(newRecommendation) {
        return await fetchIt(
            `http://localhost:8000/gameRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    //PUTs (These will change the "read" boolean to true on the server side for 
    // all of the user's recommendations)
    async readBookRecommendations() {
        return await fetchIt(
            `http://localhost:8000/bookRecommendations/read`,
            "PUT"
        )
    },
    async readShowRecommendations() {
        return await fetchIt(
            `http://localhost:8000/showRecommendations/read`,
            "PUT"
        )
    },
    async readGameRecommendations() {
        return await fetchIt(
            `http://localhost:8000/gameRecommendations/read`,
            "PUT"
        )
    },
}

