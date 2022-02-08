import { fetchIt } from "./FetchAndSort"

//Object (ShowRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const ShowRepo = {
    //GETs
    async getAll(current = null) {
        //determine portion of query string parameter that sorts by current by argument of true/false/null (null is initialized)
        if (current === true) {
            current = "&current=true"
        } else if (current === false) {
            current = "&current=false"
        } else {
            current = ""
        }
 
        return await fetchIt(`http://localhost:8088/shows${current}`)

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
        return await fetchIt(`http://localhost:8088/shows?q=${searchTerm}${current}`)
    },

    async get(id) {
        return await fetchIt(`http://localhost:8088/shows/${id}`)
    },

    async getAllStreamingServices() {
        return await fetchIt(`http://localhost:8088/streamingServices`)
    },


    //DELETEs
    async delete(id) {
        return await fetchIt(`http://localhost:8088/shows/${id}`, "DELETE")
    },

    //POSTs
    async addShow(newShow) {
        return await fetchIt(
            `http://localhost:8088/shows`,
            "POST",
            JSON.stringify(newShow)
        )
    },

    //PUTs
    async modifyShow(modifiedShow, id) {
        return await fetchIt(
            `http://localhost:8088/shows/${id}`,
            "PUT",
            JSON.stringify(modifiedShow)
        )
    },
}