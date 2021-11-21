<style>
button {
  width: 100%;
  outline: none;
  height: 35px;
  border: none;
  padding: 10px 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border: 1px solid steelblue;
}
.active-message {
  color: steelblue;
  font-weight: 500;
  padding-bottom: 4px;
}
.inactive-message {
  color: white;
  font-weight: 500;
  padding-bottom: 4px;
}
</style>

<script>
export let isActive = false
export let onClick = () => {}
export let activeMessage = ""
export let inactiveMessage = ""
</script>

<button
  on:click="{onClick}"
  style="background-color: {isActive ? 'white' : 'steelblue'}">
  {#if isActive}
    <span class="active-message">{activeMessage}</span>
  {:else}
    <span class="inactive-message">{inactiveMessage}</span>
  {/if}
</button>
