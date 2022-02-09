import { fetchIt } from "./FetchIt"

//Object (GameRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const GameRepo = {
    //GETs
    async getAll(current = null) {
        //determine portion of query string parameter that sorts by current by argument of true/false/null (null is initialized)
        if (current === true) {
            current = "?current=True"
        } else if (current === false) {
            current = "?current=False"
        } else {
            current = ""
        }
 
        return await fetchIt(`http://localhost:8000/games${current}`)

    },

    //identical to the getAll function, but also adds a query string parameter to match a string with the name property
    async getBySearchTerm(searchTerm, current = null) {
        if (current === true) {
            current = "&current=True"
        } else if (current === false) {
            current = "&current=False"
        } else {
            current = ""
        }
        return await fetchIt(`http://localhost:8000/games?q=${searchTerm}${current}`)
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