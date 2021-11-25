<style>
.main-home-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
}
.cta-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c4c4c4;
  padding: 20px 30px;
  border-radius: 15px;
  transition: 150ms;
  cursor: pointer;
}
.cta-container:hover {
  background: rgba(0, 0, 0, 0.05);
}
img {
  width: 50px;
}
.create {
  font-weight: 500;
}
.cta-buttons-wrapper {
  width: 100%;
  padding-top: 2%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script>
import { onMount } from "svelte"

import { navigate } from "svelte-routing"

import MainLayout from "../layouts/Main.svelte"
import { Theme } from "../theme"
import { setCurrentUser } from "../store/users"

import RecentBooksContainer from "../containers/RecentBooksContainer.svelte"
import UserSearchContainer from "../containers/UserSearchContainer.svelte"
import BookSearchContainer from "../containers/BookSearchContainer.svelte"

onMount(() => {
  setCurrentUser()
})

const goToForm = () => {
  navigate("/create-book")
}
const goToProfile = () => {
  navigate("/my-profile")
}
</script>

<svelte:head>
  <title>Inicio</title>
</svelte:head>

<MainLayout>
  <div class="main-home-wrapper">
    <section class="cta-buttons-wrapper">
      <div class="cta-container" on:click="{goToProfile}">
        <img src="assets/img/bookshelf-icon.png" alt="Mis historias" />
        <p style="color: {Theme.PALETTE.primary}" class="create">
          Mis historias
        </p>
      </div>

      <div
        style="margin-left: 20px"
        on:click="{goToForm}"
        class="cta-container">
        <img src="assets/img/create-icon.png" alt="Crear historia" />
        <p style="color: {Theme.PALETTE.primary}" class="create">
          Crear hitoria
          <p>{process.env.RELAY_SERVER_URL}</p>
        </p>
      </div>
    </section>

    <UserSearchContainer />
    <BookSearchContainer />
    <RecentBooksContainer />
  </div>
</MainLayout>
