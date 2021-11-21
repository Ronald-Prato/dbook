<style>
.main-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.book-container {
  max-width: 700px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 4%;
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-gap: 15px;
  box-shadow: 0 2px 4px rgba(242, 139, 5, 0.2);
  position: relative;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.avatar-section img {
  width: 80px;
  border-radius: 50%;
}
.avatar-section span {
  font-size: 15px;
  font-weight: bolder;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 6%;
}

.book-info-section {
  display: flex;
  flex-direction: column;
}
.book-info-section h2 {
  margin: 0;
  line-height: 25px;
}
.book-info-section p {
  line-height: 25px;
}
.book-info-section span {
  font-size: 15px;
  font-weight: bolder;
  color: rgba(0, 0, 0, 0.5);
}
button {
  max-width: 700px;
  width: 100%;
  margin-top: 20px;
  outline: none;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
}

.heart-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 4%;
  right: 1%;
  padding: 1%;
  cursor: pointer;
}
.stats-section {
  margin-top: 2%;
}
</style>

<script>
import MainLayout from "../layouts/Main.svelte"
import { gun } from "../gun"
import { decryptData } from "../utils/crypto-utils"
import { onMount } from "svelte"
import { currentUser } from "../store/users"
import { PAGES } from "../entities"
import { Theme } from "../theme"
import Stats from "../components/Stats.svelte"
import { navigate } from "svelte-routing"
import { updateBookLikes, addBookView } from "../utils/book-utils"

const logoPath = "images/dbook-logo.svg"

export let bookId

let currentBook
let showBook = false
let myUser
let pages = []
let bookAuthor = ""

onMount(() => {
  // Get book
  gun.get(bookId).on(async (_book) => {
    if (_book) {
      const book = await decryptData(_book.data)
      currentBook = book

      // If not published go yo home (in case of getting from url)
      if (!book.published) {
        navigate("/home")
      }

      // Get book author
      gun.get(book.createdBy).once(async (_author) => {
        const author = await decryptData(_author.data)
        bookAuthor = author
        showBook = true
      })
    }
  })

  // Count book pages
  gun
    .get(bookId)
    .get(PAGES)
    .map()
    .once(async (_page) => {
      if (_page) {
        const page = await decryptData(_page.data)
        pages = [...pages, page]
      }
    })
})

currentUser.subscribe((_user) => {
  myUser = _user
})

const handleBookLikesUpdate = () => {
  updateBookLikes(bookId)
}

const goToPage = () => {
  currentBook.createdBy !== myUser.uuid && addBookView(bookId)
  navigate(`/book/${bookId}/pages`)
}
</script>

{#if showBook}
  <MainLayout logoPath="{logoPath}">
    <div class="main-wrapper">
      <div class="book-container">
        <section class="avatar-section">
          <img src="{bookAuthor.photo}" alt="{bookAuthor.nickname}" />
          <span>Escrito por @{bookAuthor.nickname}</span>

          <div class="stats-section ">
            <Stats
              views="{currentBook.views.length}"
              likes="{currentBook.likes.length}" />
          </div>
        </section>

        <section class="book-info-section">
          <h2>{currentBook.title}</h2>
          <p>{currentBook.description}</p>
          <span>{pages.length} partes</span>
        </section>

        {#if bookAuthor.uuid !== myUser.uuid}
          {#if currentBook.likes.includes(myUser.uuid)}
            <img
              on:click="{handleBookLikesUpdate}"
              src="svg/filled-heart.svg"
              alt="heart"
              class="heart-icon" />
          {:else}
            <img
              on:click="{handleBookLikesUpdate}"
              src="svg/outline-heart.svg"
              alt="heart"
              class="heart-icon" />
          {/if}
        {/if}
      </div>

      <button
        style="background-color: {Theme.PALETTE.primary}"
        on:click="{goToPage}">
        Empezar a leer
      </button>
    </div>
  </MainLayout>
{/if}
