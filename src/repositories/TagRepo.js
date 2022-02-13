import { fetchIt } from "./FetchIt"

export const TagRepo = {
    //GETs
    async getAll() {
        return await fetchIt(`http://localhost:8000/tags`)
    },
    async getTagsBySearchTerm(searchTerm) {
        return await fetchIt(`http://localhost:8000/tags?q=${searchTerm}`)
    },
    async getTagsOnCurrent() {
        return await fetchIt(`http://localhost:8000/tags/active_current`)
    },
    async getTagsOnQueued() {
        return await fetchIt(`http://localhost:8000/tags/active_queued`)
    },
    async getTagsOnAny() {
        return await fetchIt(`http://localhost:8000/tags/active`)
    },
   
    async get(tagId) {
        return await fetchIt(`http://localhost:8000/tags/${tagId}`)
    },





    //DELETEs
    async deleteTag(tagId) {
        return await fetchIt(
            `http://localhost:8000/tags/${tagId}`,
            "DELETE"
        )
    },

    //POSTs
    async addTag(newTag) {
        return await fetchIt(
            `http://localhost:8000/tags`,
            "POST",
            JSON.stringify(newTag)
        )
    },

    async seedTags(token) {
        return fetch("http://localhost:8000/tags/seed", {
        method: "POST",
        headers: {
            "Authorization": `Token ${token}`,
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
    },




    //PUT
    async editTag(tagObj, tagId) {
        return await fetchIt(
            `http://localhost:8000/tags/${tagId}`,
            "PUT",
            JSON.stringify(tagObj)
        )
    },

}

