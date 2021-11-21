import { Theme } from "../theme"
import { currentPageIndex } from "../store/books"

let selectedPageIndex = 0

currentPageIndex.subscribe((index) => {
  console.log("New index: ", index)
  selectedPageIndex = index
})

const getColor = (index) =>
  index === selectedPageIndex ? Theme.PALETTE.primary : "black"

const getWeight = (index) => (index === selectedPageIndex ? "500" : "400")

export { getColor, getWeight }
