import { fetchIt } from "./FetchIt"

//Object (BookRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const BookRepo = {
    //GETs
    async getAll(current = "", nameSearch = "", authorId = "", tags) {
        let tagString = ""
        if (tags) {
            for (const tagId of tags) {
                tagString += `&tags=${tagId}`
            }
        }

        return await fetchIt(`http://localhost:8000/books?search=${nameSearch}&current=${current}&authorId=${authorId}${tagString}`)

    },

    async get(id) {
        return await fetchIt(`http://localhost:8000/books/${id}`)
    },

    async getAllAuthors() {
        return await fetchIt(`http://localhost:8000/authors`)
    },

    async getAuthorsByName(nameString) {
        return await fetchIt(`http://localhost:8000/authors?name=${nameString}`)
    },


    //DELETEs
    async delete(id) {
        return await fetchIt(`http://localhost:8000/books/${id}`, "DELETE")
    },

    //POSTs
    async addBook(newBook) {
        return await fetchIt(
            `http://localhost:8000/books`,
            "POST",
            JSON.stringify(newBook)
        )
    },
    async addAuthor(newAuthor) {
        return await fetchIt(
            `http://localhost:8000/authors`,
            "POST",
            JSON.stringify(newAuthor)
        )
    },

    //PUTs
    async modifyBook(modifiedBook, id) {
        return await fetchIt(
            `http://localhost:8000/books/${id}`,
            "PUT",
            JSON.stringify(modifiedBook)
        )
    },
}
