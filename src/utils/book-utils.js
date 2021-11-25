import { BOOKS } from "../entities"
import { gun, user } from "../gun"
import { decryptData, encryptData } from "./crypto-utils"

export const generateGenericBookData = (date) => {
  return {
    views: [],
    likes: [],
    photo: "",
    published: false,
    createdAt: date,
    updatedAt: date,
  }
}

export const addBookView = (bookId) => {
  const userId = user.is.epub
  gun.get(bookId).once(async (_book) => {
    const book = await decryptData(_book.data)
    const bookViews = book.views

    if (!bookViews.includes(userId)) {
      bookViews.push(userId)
      const bookNewData = await encryptData({
        ...book,
        views: bookViews,
      })

      gun.get(userId).get(BOOKS).get(bookId).put({ data: bookNewData })
      gun.get(BOOKS).get(bookId).put({ data: bookNewData })
    }
  })
}

export const updateBookLikes = (bookId) => {
  const userId = user.is.epub
  gun.get(bookId).once(async (_book) => {
    const book = await decryptData(_book.data)
    let bookLikes = book.likes

    if (!bookLikes.includes(userId)) {
      // Add like
      bookLikes.push(userId)
    } else {
      //Remove like
      bookLikes = bookLikes.filter((whoLiked) => whoLiked !== userId)
    }

    const bookNewData = await encryptData({
      ...book,
      likes: bookLikes,
    })

    gun.get(userId).get(BOOKS).get(bookId).put({ data: bookNewData })
    gun.get(BOOKS).get(bookId).put({ data: bookNewData })
  })
}
