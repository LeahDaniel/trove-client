import { fetchIt } from "./FetchIt"


export const SocialRepo = {
    //GETs
    async getUserByUsername(username) {
        return await fetchIt(`http://localhost:8088/users?username=${username}`)
    },


    async getAllGameRecommendations() {
        return await fetchIt(`http://localhost:8088/gameRecommendations`)
    },
    async getAllShowRecommendations() {
        return await fetchIt(`http://localhost:8088/showRecommendations`)
    },
    async getAllBookRecommendations() {
        return await fetchIt(`http://localhost:8088/bookRecommendations`)
    },


    //DELETEs
    async deleteGameRecommendation(id) {
        return await fetchIt(
            `http://localhost:8088/gameRecommendations/${id}`,
            "DELETE"
        )
    },
    async deleteShowRecommendation(id) {
        return await fetchIt(
            `http://localhost:8088/showRecommendations/${id}`,
            "DELETE"
        )
    },
    async deleteBookRecommendation(id) {
        return await fetchIt(
            `http://localhost:8088/bookRecommendations/${id}`,
            "DELETE"
        )
    },

    //POSTs
    async addBookRecommendation(newRecommendation) {
        return await fetchIt(
            `http://localhost:8088/bookRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    async addShowRecommendation(newRecommendation) {
        return await fetchIt(
            `http://localhost:8088/showRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    async addGameRecommendation(newRecommendation) {
        return await fetchIt(
            `http://localhost:8088/gameRecommendations`,
            "POST",
            JSON.stringify(newRecommendation)
        )
    },

    //PUTs (These will only change the "read" boolean to true on the server side)
    async modifyBookRecommendation(id) {
        return await fetchIt(
            `http://localhost:8088/bookRecommendations/${id}`,
            "PUT"
        )
    },
    async modifyShowRecommendation(id) {
        return await fetchIt(
            `http://localhost:8088/showRecommendations/${id}`,
            "PUT"
        )
    },
    async modifyGameRecommendation(id) {
        return await fetchIt(
            `http://localhost:8088/gameRecommendations/${id}`,
            "PUT"
        )
    },
}

