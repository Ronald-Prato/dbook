const USERS = process.env.ENV === "DEVELOP" ? "users-dev" : "users"
const BOOKS = process.env.ENV === "DEVELOP" ? "books-dev" : "books"
const PAGES = process.env.ENV === "DEVELOP" ? "pages-dev" : "pages"

export { USERS, BOOKS, PAGES }
