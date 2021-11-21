<style>
.book-form-wrapper {
  padding: 0 2%;
}

.textarea-wrapper {
  width: 100%;
  position: relative;
}

.word-counter {
  color: rgba(0, 0, 0, 0.4);
  position: absolute;
  right: 0;
  bottom: -5%;
}

form {
  max-width: 400px;
  width: 100%;
}

label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}

input {
  width: 100%;
  margin-bottom: 5%;
}

textarea {
  width: 100%;
  resize: none;
}

button {
  outline: none;
  border: none;
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
}
</style>

<script>
import MainLayout from "../layouts/Main.svelte"
import { Theme } from "../theme"
import { navigate } from "svelte-routing"
import { createBook } from "../service/book"
import { MAX_DESCRIPTION_LENGTH } from "../constants"
import { user } from "../gun"

let maxDescriptionLength = MAX_DESCRIPTION_LENGTH
let formData = {
  title: "",
  description: "",
}

const handleSubmit = async () => {
  if (!formData.title.trim().length) {
    alert("Escribe un título")
    return
  }
  if (!formData.description.trim().length) {
    alert("Escribe una descripción")
    return
  }

  const bookId = await createBook(formData.title, formData.description)
  navigate(`/my-books/${bookId}`)
}
</script>

<svelte:head>
  <title>Crear nueva historia</title>
</svelte:head>

<MainLayout>
  <div class="book-form-wrapper">
    <h2>Crea una historia</h2>

    <form on:submit|preventDefault="{handleSubmit}">
      <div>
        <label for="title">Título</label>
        <input
          id="title"
          bind:value="{formData.title}"
          placeholder="Escribe el título..." />
      </div>

      <div class="textarea-wrapper">
        <label for="title">Descripción</label>
        <textarea
          rows="5"
          id="description"
          bind:value="{formData.description}"
          maxlength="{maxDescriptionLength}"
          placeholder="Escribe una descripción..."></textarea>

        <span class="word-counter"
          >{formData.description.length}/{maxDescriptionLength}</span>
      </div>

      <button style="background: {Theme.PALETTE.primary}"> Crear </button>
    </form>
  </div>
</MainLayout>
