import { readJson, updateJson } from "./file_utils.js";

const sendResponse = (code, body = null) => {
    const response = {
        code,
        body,
    };

    switch (code) {
        case 200:
            response.msg = "Ok";
            break;
        case 201:
            response.msg = "Created";
            break;
        case 400:
            response.msg = "Endpoint not valid";
            break;
        case 404:
            response.msg = "Not found";
            break;
        case 500:
            response.msg = "Internal Server Error";
            break;
        case 204:
            response.msg = "No content";
            break;
        default:
            response.msg = "Unknown status code";
    }

    return response;
};


function main(){
    const args = process.argv.slice(2)
    const endPoint = args[0];

    switch(endPoint){
            case "getBook":
            const titLeOrISBN = args[1]
            console.log(getBook(titLeOrISBN))
        break;

        case "getBooks":
            console.log(getBooks())
        break;

        case "addBook":
            const title = args[1]
            const author = args[2]
            const genre = args[3]
            console.log(addBook(title, author, genre))
        break;

        case "removeBookByTitleOrISBN":
            const removeTitleOrISBN = args[1]
            console.log(removeBookByTitleOrISBN(removeTitleOrISBN))
            break;

        case "filterBy":
            const filter = args[1]
            const value = args[2]
            console.log(filterBy(filter, value))
            break;

        case "listBooks":
            console.log(listBooks())
            break;

        case "getBooksByYear":
            const year = args[1]
            console.log(getBooksByYear(parseInt(year)))
            break;

        case "genreFullAvailability":
            const genreA = args[1]
            console.log(genreFullAvailability(genreA))
            break;

        case "genrePartialAvailability":
            const genreB = args[1]
            console.log(genrePartialAvailability(genreB))
            break;

        case "getCountBy":
            const property = args[1]
            const valueCount = args[2]
            console.log(getCountBy(property, valueCount))
            break;

        default:
            console.log(sendResponse(400))
    }
}

/*const updateBookTitle = (ISBN, title) =>{
    const books = readJson("books.json")
    let updatedBook;

    const newBooks = books.map((currentBook)=>{
        if(currentBook.ISBN === ISBN){
            currentBook.title === ISBN
            updatedBook = {...book, title}
            return updatedBook
        }return book
    });
    updateFile("books-test", newBooks);
    return updatedBook;
}*/

const getBook = (nameOrISBN) => {
    try{
        const books = readJson("books.json")
        
        if(!nameOrISBN){
            return sendResponse(400);
        }
        if(books.length === 0){
            return sendResponse(204);
        }
        const book = books.find(book => book.title.toLowerCase() === nameOrISBN.toLowerCase() || book.ISBN === nameOrISBN);
        if(book === undefined){
            return sendResponse(404);
        }
        return sendResponse(200, book);
    }catch(error){
        return sendResponse(500, error);
    }
};

const getBooks = () => {
    const books = readJson("books.json")
    try{
        if(books.length === 0){
            return sendResponse(204);
        }
        return sendResponse(200, books);
    }catch(error){
        return sendResponse(500, error);
    }
};

const addBook = (title, author, genre) => {
    const books = readJson("books.json")
    let updatedBook
    try{
        if(!title || !genre || !author){
            return sendResponse(400);
        }
        const newBook = {
            title: title,
            author: author,
            genre: genre
        };
        updatedBook = [...books, newBook]
        updateJson(updatedBook, "books.json");

        return sendResponse(201,JSON.stringify({newBook, books: updatedBook}));
    }catch(error){
        return sendResponse(500, error);
    }
};

const removeBookByTitleOrISBN = (nameOrISBN) => {
    const books = readJson("books.json")
    let newBook
    try{
        if(!nameOrISBN){
            return sendResponse(400);
        }
        if(books.length === 0){
            return sendResponse(204);
        }
        const removedBook = books.find(book => book.title.toLowerCase() === nameOrISBN.toLowerCase() || book.ISBN === nameOrISBN);
        if(removedBook === undefined){         
            return sendResponse(404);
        }
        newBook = [...books]
        newBook.splice(books.indexOf(removedBook),1)
        updateJson(newBook, "books.json");

        return sendResponse(200, JSON.stringify({removedBook, newBook}));
    }catch(error){
        return sendResponse(500, error);
    }
}

const filterBy  = (filter, value) => {
    const books = readJson("books.json")
    try{
        if(!filter || !value){
            return sendResponse(400);
        }
        filter = filter.toLowerCase();
        if(filter !== "genre" && filter !== "author" && filter !== "publisher"){
            return sendResponse(400);
        }
        if(books.length === 0){
            return sendResponse(204);
        }
        const filteredBooks = books.filter((book) => book[filter].toLowerCase() === value.toLowerCase());
        if(filteredBooks.length === 0){
            return sendResponse(404);
        }
        return sendResponse(200, filteredBooks);
    }catch(error){
        return sendResponse(500, error);
    }
};

const listBooks = () => {
    const books = readJson("books.json")

    try{
        if(books.length === 0){
            return sendResponse(204);
        }
        const booksList = books.map(book =>({
            tittle: book.title,
            author: book.author,
            year: book.year
        }));
        return sendResponse(200, booksList);
    }catch(error){
        return sendResponse(500, error);
    }
}

const getBooksByYear = (year) => {
    const books = readJson("books.json")
    try{
        if (!year){
            return sendResponse(400);
        }
        if(books.length === 0){
            return sendResponse(204);
        }
        const booksYear = books.filter((books) => books.year === year);
        if(booksYear.length === 0){
            return sendResponse(404);
        }
        return sendResponse(200, booksYear);
    }catch(error){
        return sendResponse(500, error);
    }
}

const genreFullAvailability = (genre) => {
    const books = readJson("books.json")
    try{
        if (!genre){
            return sendResponse(400);
        }
        if(books.length === 0){
            return sendResponse(204);
        }
        const booksOfGenre = books.filter((book) => book.genre.toLowerCase() === genre.toLowerCase());
        if(booksOfGenre.length === 0){
            return sendResponse(404);
        }
        const availability = booksOfGenre.every((book) => book.stock > 0);
        let message = "All books of genre "+genre.toLowerCase()+" have stock: ";
        return sendResponse(200, { [message]: availability });
    }catch(error){
        return sendResponse(500, error);
    }
}

const genrePartialAvailability = (genre) => {
    const books = readJson("books.json")
    try{
        if (!genre){
            return sendResponse(400);
        }
        if(books.length === 0){
            return sendResponse(204);
        }
        const booksOfGenre = books.filter((book) => book.genre.toLowerCase() === genre.toLowerCase());
        if(booksOfGenre.length === 0){
            return sendResponse(404);
        }
        const availability = booksOfGenre.some((book) => book.stock > 0);
        let message = "At least one of books of genre "+genre.toLowerCase()+" have stock: ";
        return sendResponse(200, { [message]: availability });
    }catch(error){
        return sendResponse(500, error);
    }
}

const getCountBy = (property, value) => {
    const books = readJson("books.json")
    try {
        if (!property || !value) {
            return sendResponse(400);
        }
        property = property.toLowerCase();
        value = value.toLowerCase();
        if (property !== "genre" && property !== "author" && property !== "publisher") {
            return sendResponse(400);
        }
        if (books.length === 0) {
            return sendResponse(204);
        }
        const count = books.reduce((acc, book) => {
            if (book[property].toLowerCase() === value) {
                acc++;
            }
            return acc;
        }, 0);
        if (count === 0) {
            return sendResponse(404);
        }
        return sendResponse(200, { [property]: { [value]: count } });
    } catch (error) {
        return sendResponse(500, error);
    }
};


main()
