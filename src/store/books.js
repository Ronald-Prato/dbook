import { writable } from "svelte/store"

const currentSelectedPage = writable({
  id: "",
  title: "",
  content: "",
})

const currentPageIndex = writable(0)

const isEmptyBook = writable(false)

export { currentSelectedPage, currentPageIndex, isEmptyBook }
