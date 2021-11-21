<style>
button {
  width: 100%;
  outline: none;
  height: 35px;
  border: none;
  padding: 0 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>

<script>
import { Theme } from "../theme"

const genericFunction = () => {}
export let title = ""
export let onClick = genericFunction
export let variant = "primary"

const getDynamicStyles = () => `
  background-color: ${variant === "primary" ? Theme.PALETTE.primary : "white"};
  color: ${variant === "primary" ? "white" : Theme.PALETTE.primary};
  border: ${
    variant === "primary" ? "none" : `1px solid ${Theme.PALETTE.primary}`
  }
`
</script>

<button style="{getDynamicStyles()}" on:click="{onClick}">
  <p>{title}</p>
</button>
