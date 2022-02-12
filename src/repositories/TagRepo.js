import { fetchIt } from "./FetchIt"

export const TagRepo = {
    //GETs
    async getAll() {
        return await fetchIt(`http://localhost:8000/tags`)
    },
    async getTagsBySearchTerm(searchTerm) {
        return await fetchIt(`http://localhost:8000/tags?q=${searchTerm}`)
    },
    async getTagsOnBooks() {
        return await fetchIt(`http://localhost:8000/tags?active=books`)
    },
    async getTagsOnGames() {
        return await fetchIt(`http://localhost:8000/tags?active=games`)
    },
    async getTagsOnShows() {
        return await fetchIt(`http://localhost:8000/tags?active=shows`)
    },
    async getTagsOnAny() {
        return await fetchIt(`http://localhost:8000/tags?active=any`)
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

