<script>
import { onMount } from "svelte"
import { user } from "../gun"
import { navigate } from "svelte-routing"

let canShow = false

onMount(() => {
  if (!user.is) {
    navigate("/")
    return
  }

  navigate("/home")
})
</script>
