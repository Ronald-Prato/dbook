<style>
.title-section {
  width: 100%;
  display: flex;
  align-items: center;
}

.description-section {
  margin-bottom: 2%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.title-input {
  width: 60%;
  margin-right: 15px;
}

.description-textarea {
  max-width: 400px;
  width: 100%;
  margin-right: 20px;
}

.book-description {
  max-width: 30%;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  text-align: justify;
  margin-top: 0;
  margin-right: 20px;
}

.title-form {
  width: 100%;
  margin-top: 2%;
}
.description-form {
  width: 100%;
  display: flex;
  align-items: flex-start;
}

.title-pencil-icon {
  cursor: pointer;
  font-size: 18px;
  padding-top: 10px;
}

.description-pencil-icon {
  cursor: pointer;
  font-size: 18px;
}

.icon {
  cursor: pointer;
}

.book-info-main-wrapper {
  width: 100%;
  position: relative;
  z-index: 1;
}
.publish-button-container {
  position: absolute;
  top: 25%;
  right: 0;
}
h2 {
  margin-right: 15px;
}
</style>

<script>
import { MAX_DESCRIPTION_LENGTH } from "../constants"
import {
  updateBookTitle,
  updateBookDescription,
  publishBook,
} from "../service/book"

import StateButton from "../components/StateButton.svelte"

export let currentBook
export let bookId

let isEditingTitle = false
let isEditingDescription = false
let maxDescriptionLength = MAX_DESCRIPTION_LENGTH

const toggleTitleEdit = () => {
  isEditingTitle = !isEditingTitle
}
const toggleDescriptionEdit = () => {
  isEditingDescription = !isEditingDescription
}

const handleUpdateTitle = () => {
  updateBookTitle(bookId, currentBook.title)
  toggleTitleEdit()
}

const handleUpdateDescription = () => {
  updateBookDescription(bookId, currentBook.description)
  toggleDescriptionEdit()
}

const handlePublishBook = () => {
  if (!currentBook.published) {
    if (confirm(`¿Quieres publicar ${currentBook.title}?`)) {
      publishBook(bookId, true)
    }
  } else {
    if (confirm(`¿Quieres ocultar ${currentBook.title}?`)) {
      publishBook(bookId, false)
    }
  }
}
</script>

<div class="book-info-main-wrapper">
  <section class="title-section">
    {#if !isEditingTitle}
      <h2>{currentBook.title}</h2>
      <span on:click="{toggleTitleEdit}" class="title-pencil-icon">✏️</span>
    {:else}
      <form class="title-form" on:submit|preventDefault="{handleUpdateTitle}">
        <input autofocus class="title-input" bind:value="{currentBook.title}" />
        <span
          on:click="{handleUpdateTitle}"
          style="margin-right: 14px"
          class="icon">✅</span>
        <span on:click="{toggleTitleEdit}" class="icon">❌</span>
      </form>
    {/if}
  </section>

  <section class="description-section">
    {#if !isEditingDescription}
      <p class="book-description">{currentBook.description}</p>
      <span on:click="{toggleDescriptionEdit}" class="description-pencil-icon"
        >✏️</span>
    {:else}
      <form
        class="description-form"
        on:submit|preventDefault="{handleUpdateDescription}">
        <textarea
          rows="5"
          class="description-textarea"
          id="description"
          bind:value="{currentBook.description}"
          maxlength="{maxDescriptionLength}"
          placeholder="Escribe una descripción..."></textarea>
        <span
          on:click="{handleUpdateDescription}"
          style="margin-right: 14px"
          class="icon">✅</span>
        <span on:click="{toggleDescriptionEdit}" class="icon">❌</span>
      </form>
    {/if}
  </section>

  <div class="publish-button-container">
    <StateButton
      inactiveMessage="Publicar"
      activeMessage="Publicada"
      onClick="{handlePublishBook}"
      isActive="{currentBook.published}" />
  </div>
</div>
