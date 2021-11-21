import { gun, user } from "../gun"
import { decryptData, encryptData } from "./crypto-utils"

export const getBookIdInRoute = (preIdPathName) => {
  const path = window.location.pathname.split("/")

  const preIdPathIndex = path.findIndex(
    (singlePath) => singlePath === preIdPathName
  )
  return path[preIdPathIndex + 1]
}

export const generateGenericPageData = (date) => {
  return {
    views: [],
    content: "",
    createdAt: date,
    updatedAt: date,
  }
}

export const addPageView = (pageId) => {
  const userId = user.is.epub
  gun.get(pageId).once(async (_page) => {
    const page = await decryptData(_page.data)
    const pageViews = page.views

    if (!pageViews.includes(userId)) {
      pageViews.push(userId)
      const pageNewData = await encryptData({
        ...page,
        views: pageViews,
      })

      gun.get(pageId).put({ data: pageNewData })
    }
  })
}
