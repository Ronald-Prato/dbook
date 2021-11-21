<style>
main {
  max-width: 20%;
  width: 100%;
}

ul {
  list-style: none;
  padding: 0 0 0 20px;
  width: 88%;
  max-height: 420px;
  overflow-y: scroll;
  background: rgba(0, 0, 0, 0.02);
}

li {
  padding: 5px 10px;
  margin-bottom: 2%;
  cursor: pointer;
}

button {
  outline: none;
  height: 35px;
  border: none;
  color: white;
  padding: 0 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  cursor: pointer;
}
</style>

<script>
import { onMount } from "svelte"

import { gun } from "../gun"
import { getBookIdInRoute } from "../utils/page-utils"
import { PAGES } from "../entities"
import {
  currentSelectedPage,
  currentPageIndex,
  isEmptyBook,
} from "../store/books"
import { Theme } from "../theme"
import { quoteShortener } from "../utils/string-utils"
import { createNewPage } from "../service/book"
import { decryptData } from "../utils/crypto-utils"

let store = {}
let currentPage
let currentIndex = 0
const bookId = getBookIdInRoute("my-books")

currentSelectedPage.subscribe((sP) => {
  currentPage = sP
})

currentPageIndex.subscribe((index) => (currentIndex = index))

onMount(() => {
  gun
    .get(bookId)
    .get(PAGES)
    .map()
    .on(async (_page, key) => {
      if (_page) {
        const page = await decryptData(_page.data)
        store[key] = page
      } else {
        delete store[key]
        store = store
      }
    })
})

$: reactiveAllPages = Object.values(store).sort(
  (a, b) => a.createdAt - b.createdAt
)

$: {
  if (reactiveAllPages.filter(Boolean).length) {
    isEmptyBook.set(false)

    // Doing this cuz of the reacting behaviour from 2 sources, reactiveAllPages and currentIndex
    const index = reactiveAllPages[currentIndex]
      ? currentIndex
      : reactiveAllPages.length - 1

    const { id, title, content } = reactiveAllPages[index]

    currentSelectedPage.update((sP) => ({
      ...sP,
      title,
      id,
      content,
    }))
    currentPageIndex.set(index)
  } else {
    isEmptyBook.set(true)
  }
}

const selectAfterCreating = (pageContent) => {
  setTimeout(() => {
    selectPage(pageContent, reactiveAllPages.length - 1)
  }, 10)
}

const createNewPart = async () => {
  await createNewPage(bookId, selectAfterCreating)
}

const selectPage = (selectedPage, index) => {
  currentPageIndex.set(index)
  currentSelectedPage.set(selectedPage)
}
</script>

<main>
  <button
    on:click="{createNewPart}"
    style="background-color: {Theme.PALETTE.primary}">
    Crear parte +
  </button>

  {#if reactiveAllPages.length > 0}
    <ul>
      {#each reactiveAllPages as page, index}
        <li
          on:click="{() => selectPage(page, index)}"
          style="color: {index === currentIndex
            ? Theme.PALETTE.primary
            : 'black'};
          font-weight: {index === currentIndex ? '500' : '400'}">
          {quoteShortener(page.title, 25)}
        </li>
      {/each}
    </ul>
  {/if}
</main>
