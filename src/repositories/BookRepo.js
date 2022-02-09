import { fetchIt } from "./FetchIt"

//Object (BookRepo) with methods (functions) added onto it, making each function accessible via dot notation.
export const BookRepo = {
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
 
        return await fetchIt(`http://localhost:8000/books${current}`)

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
        return await fetchIt(`http://localhost:8000/books?q=${searchTerm}${current}`)
    },

    async get(id) {
        return await fetchIt(`http://localhost:8000/books/${id}`)
    },

    async getAllAuthors() {
        return await fetchIt(`http://localhost:8000/authors`)
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

    //PUTs
    async modifyBook(modifiedBook, id) {
        return await fetchIt(
            `http://localhost:8000/books/${id}`,
            "PUT",
            JSON.stringify(modifiedBook)
        )
    },
}
