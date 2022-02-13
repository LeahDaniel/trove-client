import { fetchIt } from "./FetchIt"

export const TagRepo = {
    //GETs
    async getAll() {
        return await fetchIt(`https://trove-server.herokuapp.com/tags`)
    },
    async getTagsBySearchTerm(searchTerm) {
        return await fetchIt(`https://trove-server.herokuapp.com/tags?q=${searchTerm}`)
    },
    async getTagsOnBooks() {
        return await fetchIt(`https://trove-server.herokuapp.com/tags?active=books`)
    },
    async getTagsOnGames() {
        return await fetchIt(`https://trove-server.herokuapp.com/tags?active=games`)
    },
    async getTagsOnShows() {
        return await fetchIt(`https://trove-server.herokuapp.com/tags?active=shows`)
    },
    async getTagsOnAny() {
        return await fetchIt(`https://trove-server.herokuapp.com/tags?active=any`)
    },
   
    async get(tagId) {
        return await fetchIt(`https://trove-server.herokuapp.com/tags/${tagId}`)
    },





    //DELETEs
    async deleteTag(tagId) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/tags/${tagId}`,
            "DELETE"
        )
    },

    //POSTs
    async addTag(newTag) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/tags`,
            "POST",
            JSON.stringify(newTag)
        )
    },

    async seedTags(token) {
        return fetch("https://trove-server.herokuapp.com/tags/seed", {
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
            `https://trove-server.herokuapp.com/tags/${tagId}`,
            "PUT",
            JSON.stringify(tagObj)
        )
    },

}

