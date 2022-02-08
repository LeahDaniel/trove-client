import { fetchIt } from "./FetchAndSort"

export const TagRepo = {
    //GETs
    async getAll() {
        return await fetchIt(`http://localhost:8088/tags`)
    },
    async getTagsBySearchTerm(searchTerm) {
        return await fetchIt(`http://localhost:8088/tags?q=${searchTerm}`)
    },
    async get(tagId) {
        return await fetchIt(`http://localhost:8088/tags/${tagId}`)
    },



    //DELETEs
    async deleteTag(tagId) {
        return await fetchIt(
            `http://localhost:8088/tags/${tagId}`,
            "DELETE"
        )
    }

    //POSTs
    async addTag(newTag) {
        return await fetchIt(
            `http://localhost:8088/tags`,
            "POST",
            JSON.stringify(newTag)
        )
    }


    //PUT
    async editTag(tagObj, tagId) {
        return await fetchIt(
            `http://localhost:8088/tags/${tagId}`,
            "PUT",
            JSON.stringify(tagObj)
        )
    },

}

