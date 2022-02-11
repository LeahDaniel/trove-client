import { fetchIt } from "./FetchIt"

//Object (GameRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const GameRepo = {
    //GETs
    async getAll(current = "", nameSearch = "", platformId = "", multiplayer= "", tags) {
        let tagString = ""
        if (tags) {
            for (const tagId of tags) {
                tagString += `&tags=${tagId}`
            }
        }

        return await fetchIt(`http://localhost:8000/games?search=${nameSearch}&current=${current}&platformId=${platformId}&multiplayer=${multiplayer}${tagString}`)
    },

    async get(id) {
        return await fetchIt(`http://localhost:8000/games/${id}`)
    },
    async getAllPlatforms() {
        return await fetchIt(`http://localhost:8000/platforms`)
    },

    //DELETEs
    async delete(id) {
        return await fetchIt(`http://localhost:8000/games/${id}`, "DELETE")
    },


    //POSTs
    async addGame(newGame) {
        return await fetchIt(
            `http://localhost:8000/games`,
            "POST",
            JSON.stringify(newGame)
        )
    },

    //PUTs
    async modifyGame(modifiedGame, id) {
        return await fetchIt(
            `http://localhost:8000/games/${id}`,
            "PUT",
            JSON.stringify(modifiedGame)
        )
    },
    async modifyPlatform(platformId, gameId) {
        return await fetchIt(
            `http://localhost:8000/games/${gameId}/platform`,
            "PUT",
            JSON.stringify({platform: platformId})
        )
    }
}