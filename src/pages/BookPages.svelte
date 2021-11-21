<style>
h1 {
  width: 100%;
  text-align: left;
  margin-bottom: 0;
  font-size: 18px;
  cursor: pointer;
}
h3 {
  margin-bottom: 0;
}
.book-wrapper {
  margin-top: 1%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5%;
}
.current-page-title {
  font-weight: bolder;
  font-size: 28px;
  width: 100%;
  text-align: center;
}

.page-contenet-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
}
.page-content {
  widows: 100%;
  margin-top: 2%;
}

.divider {
  align-self: center;
  width: 20%;
  height: 1px;
  background-color: #c3c3c3;
  margin-top: 1%;
}

.creation-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2%;
}
.creation-section img {
  width: 100%;
}
.creation-section span {
  font-size: 15px;
  color: rgb(0, 0, 0, 0.5);
  font-weight: bolder;
  margin-top: 0.8%;
  cursor: pointer;
}
.avatar-wrapper {
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.single-button-section {
  width: 100%;
  margin-top: 5%;
}

.two-button-section {
  width: 100%;
  margin-top: 5%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 100px;
}
.stats-section {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

<script>
import { onMount } from "svelte"
import Quill from "quill"
import { navigate } from "svelte-routing"

Quill.register("attributors/class/color", true)
Quill.register("attributors/class/size", true)

import MainLayout from "../layouts/Main.svelte"
import { gun } from "../gun"
import { decryptData } from "../utils/crypto-utils"
import { PAGES } from "../entities"
import { currentUser } from "../store/users"
import { addPageView } from "../utils/page-utils"

import Button from "../components/Button.svelte"
import Stats from "../components/Stats.svelte"

const logoPath = "images/dbook-logo.svg"

export let bookId

let currentBook
let showBook = false
let myUser
let allPages = []
let currentPageIndex = 0
let bookAuthor

const handleAddPageView = (index) => {
  currentBook.createdBy !== myUser.uuid && addPageView(allPages[index].id)
}

onMount(() => {
  // Get book
  gun.get(bookId).once(async (_book) => {
    if (_book) {
      const book = await decryptData(_book.data)
      currentBook = book

      // If not published go yo home (in case of getting from url)
      if (!book.published) {
        navigate("/home")
      }

      // Get book pages
      gun
        .get(bookId)
        .get(PAGES)
        .map()
        .once(async (_page) => {
          const page = await decryptData(_page.data)
          allPages = [...allPages, page].sort(
            (a, b) => a.createdAt - b.createdAt
          )
          handleAddPageView(allPages[currentPageIndex].id)
        })

      // Get book author
      gun.get(book.createdBy).once(async (_author) => {
        const author = await decryptData(_author.data)
        bookAuthor = author
        showBook = true
      })
    }
  })
})

$: currentPage = allPages[currentPageIndex]

currentUser.subscribe((_user) => {
  myUser = _user
})

const handleGoToNextPage = () => {
  handleAddPageView(currentPageIndex + 1)
  currentPageIndex++
}

const goToBook = () => {
  navigate(`/book/${bookId}`)
}
</script>

<svelte:head>
  <link href="https://cdn.quilljs.com/1.3.6/quill.core.css" rel="stylesheet" />
</svelte:head>

{#if showBook}
  <MainLayout logoPath="{logoPath}">
    <div class="book-wrapper">
      <h1 on:click="{goToBook}">{currentBook.title}</h1>

      {#if currentPage}
        <section class="page-contenet-container">
          <h3
            on:click="{() => console.log(allPages)}"
            class="current-page-title">
            {currentPage.title}
          </h3>

          <section class="creation-section">
            <div class="avatar-wrapper">
              <img
                class="small-avatar"
                src="{bookAuthor.photo}"
                alt="{bookAuthor.nickname}" />
            </div>
            <span>Escrito por @{bookAuthor.nickname}</span>
          </section>

          <section class="stats-section">
            <Stats justViews="{true}" views="{currentPage.views.length}" />
          </section>

          <div class="divider"></div>

          <div class="page-content ql-editor">
            {@html currentPage.content}
          </div>

          {#if allPages.length > 1 && currentPageIndex === 0}
            <section class="single-button-section">
              <Button title="Siguiente página" onClick="{handleGoToNextPage}" />
            </section>
          {/if}

          {#if allPages.length > 1 && currentPageIndex > 0 && currentPageIndex < allPages.length - 1}
            <section class="two-button-section">
              <Button
                variant="outline"
                title="Página anterior"
                onClick="{() => currentPageIndex--}" />
              <Button title="Siguiente página" onClick="{handleGoToNextPage}" />
            </section>
          {/if}

          {#if allPages.length > 1 && currentPageIndex === allPages.length - 1}
            <section class="single-button-section">
              <Button
                variant="outline"
                title="Página anterior"
                onClick="{() => currentPageIndex--}" />
            </section>
          {/if}
        </section>
      {/if}
    </div>
  </MainLayout>
{/if}
