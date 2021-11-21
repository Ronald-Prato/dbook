<style>
.navbar {
  width: 100%;
  height: 80px;
  box-shadow: 0 2px 4px rgba(242, 139, 5, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
  position: relative;
}

.logo {
  width: 120px;
  cursor: pointer;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;

  cursor: pointer;
  overflow: hidden;
}

@keyframes zoom-in {
  from {
    transform: scale(0.2);
  }
  to {
    transform: scale(1);
  }
}

ul {
  width: 150px;
  padding: 0;
  list-style: none;
  position: absolute;
  z-index: 100;
  right: 0;
  bottom: -105%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: zoom-in 200ms;
  overflow: hidden;
}
li {
  display: grid;
  grid-template-columns: 25px 1fr;
  padding: 5px 10px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
  transition: linear 200ms;
  cursor: pointer;
}
li:hover {
  background-color: rgb(242, 139, 5, 0.2);
}
li:last-child {
  border-bottom: none;
}
i {
  padding-top: 2px;
}
</style>

<script>
import { navigate } from "svelte-routing"
import { logoutUser } from "../service/user"
import { currentUser } from "../store/users"

export let logoPath
let showProfileMenu = false
let user

currentUser.subscribe((_currentUser) => {
  user = _currentUser
})

const goToHome = () => {
  navigate("/home")
}

const toggleMenu = (event) => {
  showProfileMenu = !showProfileMenu
}

const handleSelectOption = (option) => {
  if (option === "profile") {
    navigate("/my-profile")
  }

  if (option === "close-session") {
    logoutUser()
    navigate("/")
  }
}
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css" />
</svelte:head>

<nav class="navbar">
  <img
    on:click="{goToHome}"
    src="https://i.imgur.com/rHSrbEZ.png"
    alt="abook"
    class="logo" />

  <div on:click="{toggleMenu}" class="avatar-circle">
    <img src="{user.photo}" alt="user avatar" />
  </div>

  {#if showProfileMenu}
    <ul>
      <li on:click="{() => handleSelectOption('profile')}">
        <i class="mi mi-user"></i>
        <span>Perfil</span>
      </li>
      <li on:click="{() => handleSelectOption('close-session')}">
        <i class="mi mi-log-out"></i>
        <span>Cerrar sesión</span>
      </li>
    </ul>
  {/if}
</nav>
