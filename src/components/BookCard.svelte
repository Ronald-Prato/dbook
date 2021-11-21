<style>
@keyframes zoom-in {
  from {
    transform: scale(0.2);
  }
  to {
    transform: scale(1);
  }
}

.book-card-wrapper {
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
  position: relative;
}
.book-title {
  font-weight: bolder;
  font-size: 18px;
  color: white;
  margin: 0;
}
.book-author {
  position: absolute;
  bottom: 0;
  right: 0;
  font-weight: 500;
  font-size: 15px;
  color: white;
  margin: 0;
  padding: 0 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px 0 8px 0;
}
.views-count {
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
  margin-left: 20px;
}
.book-icon {
  font-size: 40px;
  color: white;
}
.users-icon {
  padding-top: 4px;
  margin-right: 5px;
}
</style>

<script>
import { navigate } from "svelte-routing"

import { numberParsed } from "../utils/string-utils"

export let book

const goToBook = () => {
  navigate(`/book/${book.id}`)
}
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css" />
</svelte:head>

<div on:click="{goToBook}" class="book-card-wrapper">
  <i class="mi mi-book book-icon"></i>
  <div class="text-section">
    <span class="book-title">{book.title}</span>

    <p class="views-count">
      <i class="mi mi-eye users-icon"></i>{numberParsed(book.views.length)}
    </p>
  </div>

  <span class="book-author">@{book.createdByNickname}</span>
</div>
