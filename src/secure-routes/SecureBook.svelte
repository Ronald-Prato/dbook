<script>
import { navigate } from "svelte-routing"
import { onMount } from "svelte"

import { user } from "../gun"

import Book from "../pages/Book.svelte"

let canShow = false

export let id

onMount(() => {
  if (!user.is) {
    navigate("/")
    return
  }

  canShow = true
})
</script>

<main>
  {#if canShow}
    <Book bookId="{id}" />
  {/if}
</main>
