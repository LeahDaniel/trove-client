import { fetchIt } from "./FetchIt"

//Object (BookRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const BookRepo = {
    //GETs
    async getAll(current = "", tags, nameSearch = "", authorId = "") {
        let tagString = ""
        if (tags) {
            for (const tagId of tags) {
                tagString += `&tags=${tagId}`
            }
        }

        return await fetchIt(`https://trove-server.herokuapp.com/books?search=${nameSearch}&current=${current}&authorId=${authorId}${tagString}`)
    },

    async get(id) {
        return await fetchIt(`https://trove-server.herokuapp.com/books/${id}`)
    },

    async getAllAuthors() {
        return await fetchIt(`https://trove-server.herokuapp.com/authors`)
    },

    async getAuthorsByName(nameString) {
        return await fetchIt(`https://trove-server.herokuapp.com/authors?name=${nameString}`)
    },
    async getAuthorsOnCurrent() {
        return await fetchIt(`https://trove-server.herokuapp.com/authors/active_current`)
    },
    async getAuthorsOnQueued() {
        return await fetchIt(`https://trove-server.herokuapp.com/authors/active_queued`)
    },


    //DELETEs
    async delete(id) {
        return await fetchIt(`https://trove-server.herokuapp.com/books/${id}`, "DELETE")
    },

    //POSTs
    async addBook(newBook) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/books`,
            "POST",
            JSON.stringify(newBook)
        )
    },
    async addAuthor(newAuthor) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/authors`,
            "POST",
            JSON.stringify(newAuthor)
        )
    },

    //PUTs
    async modifyBook(modifiedBook, id) {
        return await fetchIt(
            `https://trove-server.herokuapp.com/books/${id}`,
            "PUT",
            JSON.stringify(modifiedBook)
        )
    },
}
