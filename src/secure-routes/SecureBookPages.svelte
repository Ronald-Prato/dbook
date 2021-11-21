<script>
import { navigate } from "svelte-routing"
import { onMount } from "svelte"

import { user } from "../gun"

import BookPages from "../pages/BookPages.svelte"

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
    <BookPages bookId="{id}" />
  {/if}
</main>
