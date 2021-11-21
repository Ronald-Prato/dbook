<script>
import { navigate } from "svelte-routing"
import { onMount } from "svelte"

import { gun, user } from "../gun"
import { getBookIdInRoute } from "../utils/page-utils"
import { decryptData } from "../utils/crypto-utils"

import BookEdit from "../pages/BookEdit.svelte"

let canShow = false

onMount(() => {
  const bookId = getBookIdInRoute("my-books")

  if (!user.is) {
    navigate("/")
    return
  }

  gun.get(bookId).once(async (_book) => {
    const book = await decryptData(_book.data)

    if (book.createdBy !== user.is.epub) {
      navigate("/home")
    } else {
      canShow = true
    }
  })
})
</script>

<main>
  {#if canShow}
    <BookEdit />
  {/if}
</main>
