<style>
h1 {
  font-size: 24px;
}
.custom-searchbar-container {
  width: 350px;
  max-height: 40px;
  border-radius: 8px;
  border: 1px solid #f28b05;
  padding: 2px 15px;
  display: grid;
  grid-template-columns: 20px 1fr 20px;
  grid-gap: 10px;
}
.custom-searchbar-container input {
  outline: none;
  border: none;
  font-size: 15px;
  max-height: 40px;
  padding: 0;
  margin: 0;
}
.search-icon {
  font-size: 18px;
  align-self: center;
  color: #4a453d;
  cursor: pointer;
  padding-top: 4px;
}
.results-container {
  width: 100%;
  max-width: 50%;
  max-height: 250px;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 2%;
}

.empty-message {
  margin: 0;
  font-weight: bolder;
  color: #f28b05;
}
</style>

<script>
import { SyncLoader } from "svelte-loading-spinners"

import { gun, user } from "../gun"
import { Theme } from "../theme"
import { BOOKS } from "../entities"
import { decryptData } from "../utils/crypto-utils"
import { smartFilter } from "../utils/string-utils"

import BookCard from "../components/BookCard.svelte"

let searchValue = ""
let results = []
let prevSearch = ""
let hasSearch = false
let timer
let isSearching = false

const handleResetSearch = () => {
  searchValue = ""
  prevSearch = ""
  results = []
  hasSearch = false
  clearTimeout(timer)
  isSearching = false
}

const handleTextChange = (event) => {
  const eventValue = event.target.value.trim()
  const value = eventValue.replace("@", "")

  if (!value.length) {
    handleResetSearch()
    return
  }

  isSearching = true
  searchValue = value
  clearTimeout(timer)
  timer = setTimeout(() => {
    handleSearch()
  }, 800)
}

const handleSearch = () => {
  if (prevSearch === searchValue) {
    return
  }

  hasSearch = true
  prevSearch = searchValue
  results = []

  gun
    .get(BOOKS)
    .map()
    .once(async (_broughtBook) => {
      const broughtBook = await decryptData(_broughtBook.data)

      gun.get(broughtBook.createdBy).once(async (_author) => {
        const author = await decryptData(_author.data)
        const withAuthorBook = {
          ...broughtBook,
          createdByNickname: author.nickname,
        }

        results = [...results, withAuthorBook].filter(
          (result) => result.createdBy !== user.is.epub && result.published
        )
      })
    })
  isSearching = false
}

$: filteredResults = smartFilter(searchValue.trim(), ["title"], results)
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css" />
</svelte:head>

<div>
  <h1 style="color: {Theme.PALETTE.gray}">Buscar historia</h1>

  <div class="custom-searchbar-container">
    <i class="mi mi-search search-icon"></i>
    <input
      placeholder="Busca por título"
      on:input="{handleTextChange}"
      value="{searchValue}" />
    <i on:click="{handleResetSearch}" class="mi mi-close search-icon"></i>
  </div>
</div>

{#if isSearching}
  <div style="margin-top: 20px">
    <SyncLoader
      size="30"
      color="{Theme.PALETTE.primary}"
      unit="px"
      duration="1s" />
  </div>
{/if}

<section class="results-container">
  {#if filteredResults.length && !isSearching}
    {#each filteredResults as result}
      <BookCard book="{result}" />
    {/each}
  {:else if searchValue.trim().length && !isSearching && hasSearch}
    <p class="empty-message">Sin resultados</p>
  {/if}
</section>
