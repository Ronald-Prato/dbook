<script>
import { onMount } from "svelte"
import { user } from "../gun"
import { navigate } from "svelte-routing"

import BookForm from "../pages/BookForm.svelte"

let canShow = false

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
    <BookForm />
  {/if}
</main>
