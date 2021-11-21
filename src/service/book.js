import { gun, user } from "../gun"
import { BOOKS, PAGES } from "../entities"
import { v4 as uuidv4 } from "uuid"
import { decryptData, encryptData } from "../utils/crypto-utils"
import { generateGenericPageData } from "../utils/page-utils"
import { generateGenericBookData } from "../utils/book-utils"

// General update functions ==========================================================

const updateBookField = (bookId, field, data) => {
  // Update book from user
  gun.get(bookId).once(async (_book) => {
    const book = await decryptData(_book.data)

    const newData = await encryptData({
      ...book,
      [field]: data,
    })

    gun.get(bookId).put({
      data: newData,
    })
  })
}

const updatePageField = (pageId, field, data) => {
  gun.get(pageId).once(async (_page) => {
    const page = await decryptData(_page.data)

    const newData = await encryptData({
      ...page,
      [field]: data,
    })

    gun.get(pageId).put({
      data: newData,
    })
  })
}
// ====================================================================================

export const createBook = async (title, description) => {
  const userId = user.is.epub
  const currentBooks = gun.get(userId).get(BOOKS)
  const allBooks = gun.get(BOOKS)
  const bookId = uuidv4()
  const pageId = uuidv4()
  const date = new Date().getTime()

  const genericBookData = generateGenericBookData(date)
  const bookContent = await encryptData({
    id: bookId,
    title,
    description,
    createdBy: userId,
    ...genericBookData,
  })
  const newBook = gun.get(bookId).put({ data: bookContent })

  const genericPageInfo = generateGenericPageData(date)
  const pageContent = await encryptData({
    id: pageId,
    title: "Primera parte",
    ...genericPageInfo,
  })
  const firstPage = gun.get(pageId).put({ data: pageContent })

  newBook.get(PAGES).set(firstPage)
  currentBooks.set(newBook)
  allBooks.set(newBook)
  return bookId
}

const updateBookTimestamps = (bookId) => {
  const newDate = new Date().getTime()
  updateBookField(bookId, "updatedAt", newDate)
}

export const createNewPage = async (bookId, callback) => {
  updateBookTimestamps(bookId)

  const pageId = uuidv4()

  const genericPageInfo = generateGenericPageData(new Date().getTime())
  const pageContent = {
    id: pageId,
    title: "Nueva parte",
    ...genericPageInfo,
  }
  const encryptedContent = await encryptData(pageContent)
  const newPage = gun.get(pageId).put({ data: encryptedContent })

  const currentBook = gun.get(bookId)

  currentBook.get(PAGES).set(newPage)
  callback(pageContent)
}

export const updatePageName = (bookId, pageId, newTitle) => {
  updateBookTimestamps(bookId)
  updatePageField(pageId, "title", newTitle)
}

export const updatePageContent = (bookId, pageId, newContent) => {
  updateBookTimestamps(bookId)
  updatePageField(pageId, "content", newContent)
}

export const deletePage = (bookId, pageId) => {
  updateBookTimestamps(bookId)
  const currentBook = gun.get(bookId)
  currentBook.get(PAGES).get(pageId).put(null)
}

export const updateBookTitle = (bookId, newTitle) => {
  updateBookTimestamps(bookId)
  updateBookField(bookId, "title", newTitle)
}

export const updateBookDescription = (bookId, newDescription) => {
  updateBookTimestamps(bookId)
  updateBookField(bookId, "description", newDescription)
}

export const deleteBook = (bookId) => {
  gun.get(user.is.epub).get(BOOKS).get(bookId).put(null)
  gun.get(BOOKS).get(bookId).put(null)
}

export const publishBook = (bookId, isPublished) => {
  updateBookField(bookId, "published", isPublished)
}
