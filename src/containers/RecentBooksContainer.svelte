<style>
h1 {
  font-size: 24px;
  margin-top: 4%;
}
.empty-container {
  width: 100%;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2%;
}
.empty-container > p {
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

.book-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 30px;
}
.book-case {
  width: 200px;
  height: 300px;
  border-radius: 8px;
  position: relative;
  z-index: 10;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.book-user-nickname {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 5px 10px;
  border-radius: 0 8px 0 0;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(0, 0, 0, 0.1);
}
.book-icon {
  font-size: 80px;
  color: white;
}

.book-content {
  min-width: 320px;
  max-width: 320px;
  height: 300px;
  border-radius: 0 8px 8px 0;
  box-shadow: inset 0 0 2px orange;
  margin-left: -1%;
  padding: 2% 4%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: scroll;
}

.book-title {
  font-size: 20px;
  font-weight: 500;
  overflow-wrap: break-word;
  line-height: 22px;
  cursor: pointer;
}
.book-description {
  line-height: 20px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  text-align: justify;
}
.metadata-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.updated-at {
  font-size: 14px;
}

.recent-books-main-wrapper {
  width: 1550px;
}

.books-show-range-message {
  font-weight: 500;
  font-size: 18px;
}

ul {
  width: 100%;
  max-width: 1550px;
  margin-top: 2%;
  padding: 0 0 2% 0;
  display: flex;
  overflow: scroll;
}
</style>

<script>
import { onMount } from "svelte"
import { format } from "date-fns"
import { navigate } from "svelte-routing"
import { es } from "date-fns/locale"

import { BOOKS } from "../entities"
import { gun } from "../gun"
import { Theme } from "../theme"
import { quoteShortener } from "../utils/string-utils"
import { decryptData } from "../utils/crypto-utils"
import { RECENT_BOOK_DAYS_INTERVAL } from "../constants"
import { subDays } from "date-fns"

let store = {}

const date = new Date()
// Date of two days ago from now
const floorDate = subDays(date.getTime(), RECENT_BOOK_DAYS_INTERVAL).getTime()

onMount(() => {
  gun
    .get(BOOKS)
    .map()
    .on(async (_book, key) => {
      if (_book) {
        const book = await decryptData(_book.data)

        if (!book.published) {
          return
        }

        if (book.createdAt < floorDate) {
          return
        }

        console.log("Created By ", book.createdBy)
        gun.get(book.createdBy).once(async (_user) => {
          console.log("USER: ", _user)
          const user = await decryptData(_user.data)
          const parsedBook = {
            ...book,
            createdByNickname: user.nickname,
          }
          store[key] = parsedBook
        })
      } else {
        delete store[key]
        store = store
      }
    })
})

$: reactiveBooksList = Object.values(store).sort(
  (a, b) => a.createdAt - b.createdAt
)

const goToBook = (bookId) => {
  navigate(`/book/${bookId}`)
}

const getDate = (date) => {
  if (!date) {
    return
  }

  const formated = format(date, "MMM dd, yyyy - hh:mma", { locale: es })
  const parsedDate =
    formated.charAt(0).toUpperCase() + formated.slice(1, formated.length)

  return parsedDate
}
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css" />
</svelte:head>

<div class="recent-books-main-wrapper">
  {#if reactiveBooksList.length}
    <h1 style="color: {Theme.PALETTE.gray}">
      Historias recientes <span class="books-show-range-message"
        >(últimas 24h)</span>
    </h1>
    <ul>
      {#each reactiveBooksList as book}
        <li class="book-container">
          <div
            on:click="{() => goToBook(book.id)}"
            style="background-color: {Theme.PALETTE.primary}"
            class="book-case">
            <span class="book-user-nickname">@{book.createdByNickname}</span>
            <i class="mi mi-book book-icon"></i>
          </div>
          <div class="book-content">
            <h3 on:click="{() => goToBook(book.id)}" class="book-title">
              {quoteShortener(book.title, 80)}
            </h3>

            <p class="book-description">{book.description}</p>

            <div class="metadata-container">
              <span class="updated-at">
                <b>Actualizada</b>
                <i style="letter-spacing:0.9px">{getDate(book.updatedAt)}</i>
              </span>

              <div
                style="display: flex; justify-content: flex-start; align-items: center; margin-top: 5px">
                <div style="display:flex;">
                  <i
                    class="mi mi-eye"
                    style="font-size: 20px; align-self: center; margin-right: 5px; color: {Theme
                      .PALETTE.gray}"></i>
                  <span style="color: {Theme.PALETTE.gray}; font-weight:500"
                    >{book.views.length}</span>
                </div>
                <div style="display:flex; margin-left: 20px">
                  <i
                    class="mi mi-heart"
                    style="font-size: 20px; align-self: center; margin-right: 5px; color: {Theme
                      .PALETTE.gray}"></i>
                  <span style="color: {Theme.PALETTE.gray}; font-weight:500"
                    >{book.likes.length}</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="empty-container">
      <p>Nadie ha creado historias aún, ¡Empieza tú!</p>
    </div>
  {/if}
</div>
