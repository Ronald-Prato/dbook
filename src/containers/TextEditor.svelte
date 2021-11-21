<style>
main {
  width: 100%;
  margin-top: -0.8%;
}

.empty-message {
  margin: auto;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 500;
}
.editor {
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  min-height: 400px;
}
h1 {
  margin: 0 15px 0 0;
  padding: 0;
  font-size: 28px;
}
.title-wrapper {
  width: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
span {
  cursor: pointer;
  font-size: 18px;
  padding-top: 10px;
}
.title-input {
  min-width: 300px;
  margin-right: 20px;
}

.top-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.saving-state {
  margin: 0;
  padding: 0;
}
.delete-text {
  color: tomato;
  cursor: pointer;
}
section {
  margin-bottom: 1%;
}
</style>

<script>
import { quill } from "svelte-quill"

import { getBookIdInRoute } from "../utils/page-utils"
import {
  currentSelectedPage,
  currentPageIndex,
  isEmptyBook,
} from "../store/books"
import { updatePageContent, updatePageName, deletePage } from "../service/book"
import { Theme } from "../theme"
import { DoubleBounce } from "svelte-loading-spinners"

const quillOptions = {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, true] }],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      ["bold", "italic", "underline", "strike"],
    ],
  },
  placeholder: "Empieza a escribir tu historia...",
  theme: "bubble",
}

let bookId = getBookIdInRoute("my-books")
let blockEditorReload = false
let htmlContent = ""
let showEditor = false
let isEmpty = false
let timer
let contentSaved = true
let editionMode = false
let currentPage = {
  id: "",
  title: "",
  content: "",
}

isEmptyBook.subscribe((empty) => {
  isEmpty = empty
})

currentSelectedPage.subscribe((sP) => {
  currentPage = sP

  if (!blockEditorReload) {
    htmlContent = sP.content
    showEditor = false
    setTimeout(() => {
      showEditor = true
    }, 1)
  }
})

currentPageIndex.subscribe(() => {
  showEditor = false
  setTimeout(() => {
    showEditor = true
    blockEditorReload = false
  }, 1)
})

const toggleEditionMode = () => {
  editionMode = !editionMode
}

const applyChanges = () => {
  updatePageName(bookId, currentPage.id, currentPage.title)
  toggleEditionMode()
}
const discardChanges = () => {
  toggleEditionMode()
}

const handleTextChange = (event) => {
  const html = event.detail.html

  contentSaved = false
  clearTimeout(timer)
  timer = setTimeout(() => {
    saveChanges(html)
  }, 800)
}

const saveChanges = (newContent) => {
  blockEditorReload = true
  updatePageContent(bookId, currentPage.id, newContent)
  contentSaved = true
}

const handleDelete = () => {
  if (confirm("Seguro que quieres eliminar esta parte?")) {
    deletePage(bookId, currentPage.id)
  }
}
</script>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
  <link href="//cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet" />
  <link
    rel="stylesheet"
    href="https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css" />
</svelte:head>

{#if isEmpty}
  <div
    style="display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%">
    <i class="mi mi-inbox" style="font-size:50px;color:{Theme.PALETTE.gray}"
    ></i>
    <p class="empty-message">Añade una parte para empezar</p>
  </div>
{:else}
  <main>
    <section>
      {#if !editionMode}
        <div class="top-wrapper">
          <div class="title-wrapper">
            <h1>{currentPage.title}</h1>
            <span on:click="{toggleEditionMode}" class="icon">✏️</span>
          </div>
          {#if contentSaved}
            <p style="color: {Theme.PALETTE.primary}" class="saving-state">
              Guardado
            </p>
          {:else}
            <DoubleBounce
              size="30"
              color="{Theme.PALETTE.primary}"
              unit="px"
              duration="1s" />
          {/if}
        </div>

        <b on:click="{handleDelete}" class="delete-text">Eliminar</b>
      {:else}
        <form on:submit|preventDefault="{applyChanges}">
          <input
            autofocus
            class="title-input"
            bind:value="{currentPage.title}" />
          <span on:click="{applyChanges}" style="margin-right: 14px">✅</span>
          <span on:click="{discardChanges}">❌</span>
        </form>
      {/if}
    </section>

    {#if showEditor}
      <div
        class="editor"
        id="editor"
        use:quill="{quillOptions}"
        on:text-change="{handleTextChange}">
        {@html htmlContent}
      </div>
    {/if}
  </main>
{/if}
