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
.empty-container > button {
  outline: none;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
}
.book-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 40px;
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

.delete-button {
  position: absolute;
  color: tomato;
  top: 4%;
  right: 4%;
  font-size: 22px;
  cursor: pointer;
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

.create-story-cta {
  font-weight: bolder;
  color: steelblue;
  cursor: pointer;
}

.book-visibility-publish,
.book-visibility-no-publish {
  position: absolute;
  top: 2%;
  margin: 0 auto;
  padding: 2px 12px;
  background-color: white;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
}

.book-visibility-publish {
  color: #49c953;
}

.book-visibility-no-publish {
  color: #4a453d;
}

ul {
  margin-top: 2%;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
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
import { deleteBook } from "../service/book"
import { decryptData } from "../utils/crypto-utils"
import Stats from "../components/Stats.svelte"

export let listTitle
export let isOwn = false
export let userId

let store = {}
let hasSet = false

const getBooks = () => {
  if (hasSet) {
    return
  }

  gun
    .get(userId)
    .get(BOOKS)
    .map()
    .on(async (_book, key) => {
      if (_book) {
        const book = await decryptData(_book.data)

        // If is a public profile, just show published stories
        if (!isOwn && !book.published) {
          return
        }

        store[key] = book
      } else {
        delete store[key]
        store = store
      }
    })
  hasSet = true
}

$: {
  if (userId) {
    getBooks()
  }
}

$: reactiveBooksList = Object.values(store).sort(
  (a, b) => a.createdAt - b.createdAt
)

const goToForm = () => {
  navigate("/create-book")
}

const goToEditMyBook = (bookId) => {
  navigate(`/my-books/${bookId}`)
  location.reload()
}

const goToBook = (bookId) => {
  navigate(`/book/${bookId}`)
  location.reload()
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

const handleDeleteBook = (bookId, title) => {
  if (confirm(`¿Eliminar ${title}?`)) {
    deleteBook(bookId)
  }
}

const handleCreateNewStory = () => {
  navigate(`/create-book`)
}
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css" />
</svelte:head>

{#if reactiveBooksList.length}
  {#if listTitle}
    <h1 style="color: {Theme.PALETTE.gray}">{listTitle}</h1>
  {/if}

  {#if isOwn}
    <span on:click="{handleCreateNewStory}" class="create-story-cta"
      >Crear nueva historia</span>
  {/if}

  <ul>
    {#each reactiveBooksList as book}
      <li class="book-container">
        <div
          on:click="{() =>
            isOwn ? goToEditMyBook(book.id) : goToBook(book.id)}"
          style="background-color: {Theme.PALETTE.primary}"
          class="book-case">
          {#if isOwn}
            {#if book.published}
              <span class="book-visibility-publish">Publicada</span>
            {:else}
              <span class="book-visibility-no-publish">Sin publicar</span>
            {/if}
          {/if}

          <i class="mi mi-book book-icon"></i>
        </div>
        <div class="book-content">
          {#if isOwn}
            <i
              on:click="{() => handleDeleteBook(book.id, book.title)}"
              class="mi mi-delete delete-button"></i>
          {/if}
          <h3 on:click="{() => goToBook(book.id)}" class="book-title">
            {quoteShortener(book.title, 80)}
          </h3>

          <p class="book-description">{book.description}</p>

          <div class="metadata-container">
            <span class="updated-at">
              <b>Actualizada</b>
              <i style="letter-spacing:0.9px">{getDate(book.updatedAt)}</i>
            </span>

            <Stats views="{book.views.length}" likes="{book.likes.length}" />
          </div>
        </div>
      </li>
    {/each}
  </ul>
{:else}
  <div class="empty-container">
    {#if isOwn}
      <p>Aún no tienes historias</p>
      <button
        style="background-color: {Theme.PALETTE.primary}"
        on:click="{goToForm}">
        Crear una histora
      </button>
    {:else}
      <p>Sin historias aún</p>
    {/if}
  </div>
{/if}
