<style>
.book-edit-wrapper {
  padding: 0 2%;
}
.content-container {
  display: flex;
  justify-content: space-between;
}
</style>

<script>
import { onMount } from "svelte"

import MainLayout from "../layouts/Main.svelte"
import { gun } from "../gun"
import PagesContainer from "../containers/PagesContainer.svelte"
import TextEditor from "../containers/TextEditor.svelte"
import { getBookIdInRoute } from "../utils/page-utils"
import BookInfoContainer from "../containers/BookInfoContainer.svelte"
import { decryptData } from "../utils/crypto-utils"

const logoPath = "images/dbook-logo.svg"

let showPage = false
let currentBook
let bookId = ""

onMount(() => {
  bookId = getBookIdInRoute("my-books")
  gun.get(bookId).on(async (_book) => {
    const book = await decryptData(_book.data)
    if (book) {
      currentBook = book
      showPage = true
    }
  })
})
</script>

<svelte:head>
  {#if currentBook}
    <title>{currentBook.title}</title>
  {/if}
</svelte:head>

{#if showPage}
  <MainLayout logoPath="{logoPath}">
    <div class="book-edit-wrapper">
      <BookInfoContainer bookId="{bookId}" currentBook="{currentBook}" />

      <div class="content-container">
        <PagesContainer />
        <TextEditor />
      </div>
    </div>
  </MainLayout>
{/if}
