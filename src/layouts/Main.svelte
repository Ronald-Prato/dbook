<style>
main {
  max-width: 1350px;
  min-width: 1250px; /*this could change later with responsive design tho*/
  min-height: 100vh;
  width: 100%;
}
</style>

<script>
import Navbar from "../components/Navbar.svelte"
export let logoPath = "assets/img/dbook-logo.svg"
</script>

<main>
  <Navbar logoPath="{logoPath}" />

  <slot />
</main>
