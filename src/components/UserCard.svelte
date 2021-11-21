<style>
@keyframes zoom-in {
  from {
    transform: scale(0.2);
  }
  to {
    transform: scale(1);
  }
}

.user-card-wrapper {
  width: fit-content;
  border-radius: 8px;
  background-color: rgb(242, 139, 5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: zoom-in 250ms ease;
}
.user-nickname {
  font-weight: bolder;
  font-size: 18px;
  color: white;
  margin: 0;
}
.followers-count {
  font-weight: 400;
  font-size: 16px;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
}
.text-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
}
img {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color: white;
  padding: 5px;
}
i {
  padding-top: 4px;
  margin-right: 5px;
}
</style>

<script>
import { navigate } from "svelte-routing"
import { PROFILE_DOT_REPLACEMENT } from "../constants"

import { numberParsed } from "../utils/string-utils"

export let user

const goToProfile = (userId) => {
  const parsedUserId = userId.replace(".", PROFILE_DOT_REPLACEMENT)
  navigate(`/user/${parsedUserId}`)
}
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css" />
</svelte:head>

<div on:click="{() => goToProfile(user.uuid)}" class="user-card-wrapper">
  <img alt="{user.nickname}" src="{user.photo}" class="user-photo-wrapper" />
  <div class="text-section">
    <span class="user-nickname">@{user.nickname}</span>

    <p class="followers-count">
      <i class="mi mi-users"></i>{numberParsed(user.followers.length)}
    </p>
  </div>
</div>
