import { fetchIt } from "./FetchIt"

//Object (ShowRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const ShowRepo = {
    //GETs
    async getAll(current = "", nameSearch = "", streamingServiceId = "", tags) {
        let tagString = ""
        if (tags) {
            for (const tagId of tags) {
                tagString += `&tags=${tagId}`
            }
        }

        return await fetchIt(`http://localhost:8000/shows?search=${nameSearch}&current=${current}&streamingServiceId=${streamingServiceId}${tagString}`)
    },

    async get(id) {
        return await fetchIt(`http://localhost:8000/shows/${id}`)
    },

    async getAllStreamingServices() {
        return await fetchIt(`http://localhost:8000/streamingServices`)
    },


    //DELETEs
    async delete(id) {
        return await fetchIt(`http://localhost:8000/shows/${id}`, "DELETE")
    },

    //POSTs
    async addShow(newShow) {
        return await fetchIt(
            `http://localhost:8000/shows`,
            "POST",
            JSON.stringify(newShow)
        )
    },

    //PUTs
    async modifyShow(modifiedShow, id) {
        return await fetchIt(
            `http://localhost:8000/shows/${id}`,
            "PUT",
            JSON.stringify(modifiedShow)
        )
    },
}