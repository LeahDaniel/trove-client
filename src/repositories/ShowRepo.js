import { fetchIt } from "./FetchIt"

//Object (ShowRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const ShowRepo = {
    //GETs
    async getAll(current="", tags, nameSearch = "",  streamingServiceId = "") {
        let tagString = ""
        if (tags) {
            for (const tagId of tags) {
                tagString += `&tags=${tagId}`
            }
        }

        return await fetchIt(`https://trove-server.herokuapp.com/shows?search=${nameSearch}&current=${current}&streamingServiceId=${streamingServiceId}${tagString}`)
    },

    async get(id) {
        return await fetchIt(`https://trove-server.herokuapp.com/shows/${id}`)
    },

    async getAllStreamingServices() {
        return await fetchIt(`https://trove-server.herokuapp.com/streamingServices`)
    },


    //DELETEs
    async delete(id) {
        return await fetchIt(`https://trove-server.herokuapp.com/shows/${id}`, "DELETE")
    },

    //POSTs
    async addShow(newShow) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/shows`,
            "POST",
            JSON.stringify(newShow)
        )
    },

    //PUTs
    async modifyShow(modifiedShow, id) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/shows/${id}`,
            "PUT",
            JSON.stringify(modifiedShow)
        )
    },
}