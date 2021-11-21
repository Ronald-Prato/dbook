<style>
.dbook-logo {
  width: 300px;
  position: absolute;
  top: 10%;
}
</style>

<script>
import CenterLayout from "../layouts/Center.svelte"
import LoginBox from "../containers/LoginBox.svelte"
import SignUpBox from "../containers/SignUpBox.svelte"

let authOption = "login"
</script>

<svelte:head>
  <title>Iniciar sesión</title>
</svelte:head>

<img class="dbook-logo" alt="DBook" src="https://i.imgur.com/rHSrbEZ.png" />

<CenterLayout>
  {#if authOption === "login"}
    <LoginBox onChangeAuthOption="{() => (authOption = 'signup')}" />
  {:else if authOption === "signup"}
    <SignUpBox onChangeAuthOption="{() => (authOption = 'login')}" />
  {/if}
</CenterLayout>
