<script>
import { navigate } from "svelte-routing"

import { onMount } from "svelte"
import { user } from "../gun"
import MyProfile from "../pages/Profile.svelte"

let canShow = false
export let userId

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
    <MyProfile userId="{userId}" />
  {/if}
</main>
