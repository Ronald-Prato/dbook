<style>
.profile-header {
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.profile-wrapper {
  padding-bottom: 5%;
  width: 100%;
}

.stats-section {
  margin-top: 2%;
}

.user-nickname-container {
  margin-top: 20px;
  position: relative;
  width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.follow-button-container {
  margin-top: 20px;
}
</style>

<script>
import MainLayout from "../layouts/Main.svelte"
import { currentUser } from "../store/users"

import AvatarEditorContainer from "../containers/AvatarEditorContainer.svelte"
import BookListContainer from "../containers/BooksListContainer.svelte"
import StatsContainer from "../containers/StatsContainer.svelte"
import { gun, user } from "../gun"
import { BOOKS } from "../entities"
import { Theme } from "../theme"
import { decryptData } from "../utils/crypto-utils"
import { updateFollowers } from "../utils/user-utils"

import StateButton from "../components/StateButton.svelte"
import { PROFILE_DOT_REPLACEMENT } from "../constants"

let isMyProfile = window.location.pathname.split("/")[1] === "my-profile"

export let userId

const parsedUserId = userId && userId.replace(PROFILE_DOT_REPLACEMENT, ".")

// This checks if you access to your profile in the url instead of "my-profile" route
if (userId && parsedUserId === user.is.epub) {
  isMyProfile = true
}

// Static object at first in order to not break the app
let userToShow = {
  followers: [],
  followed: [],
}
let myUser
let stories = []
let showProfile = false

const getPathUser = () => {
  console.log({ userId, parsedUserId })
  gun.get(parsedUserId).once(async (_broughtUser) => {
    if (_broughtUser) {
      const broughtUser = await decryptData(_broughtUser.data)
      userToShow = broughtUser
      showProfile = true
    }
  })
}

if (isMyProfile) {
  currentUser.subscribe((_currentUser) => {
    userToShow = _currentUser
    showProfile = true

    gun
      .get(_currentUser.uuid)
      .get(BOOKS)
      .map()
      .once((_, key) => {
        stories = [...stories, key]
      })
  })
} else {
  currentUser.subscribe((_currentUser) => {
    myUser = _currentUser
  })

  getPathUser()
}

const handleAddFollower = () => {
  updateFollowers(userToShow.uuid, () => getPathUser())
}
</script>

<svelte:head>
  <title>{isMyProfile ? "Mi perfil" : `Perfil | ${userToShow.nickname}`}</title>
</svelte:head>

<MainLayout>
  <div class="profile-wrapper">
    {#if showProfile}
      <header class="profile-header">
        <AvatarEditorContainer
          isOwn="{isMyProfile}"
          photo="{userToShow.photo}" />
        <div class="user-nickname-container">
          <h1 style="color:{Theme.PALETTE.gray};margin:0">
            @{userToShow.nickname}
          </h1>
        </div>

        {#if !isMyProfile}
          <div class="follow-button-container">
            <StateButton
              inactiveMessage="Seguir"
              activeMessage="Siguiendo"
              onClick="{handleAddFollower}"
              isActive="{userToShow.followers.includes(myUser.uuid)}" />
          </div>
        {/if}
      </header>

      <section class="stats-section">
        <StatsContainer
          storiesNumber="{stories.length}"
          followersNumber="{userToShow.followers
            ? userToShow.followers.length
            : 0}"
          followedNumber="{userToShow.followed
            ? userToShow.followed.length
            : 0}" />
      </section>

      <BookListContainer
        userId="{userToShow.uuid}"
        isOwn="{isMyProfile}"
        listTitle="Historias de @{userToShow.nickname}" />
    {/if}
  </div>
</MainLayout>
