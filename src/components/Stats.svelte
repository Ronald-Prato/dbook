<script>
import { Theme } from "../theme"
import { numberParsed } from "../utils/string-utils"

export let views = 0
export let likes = 0
export let justViews = false
</script>

<div
  style="display: flex; justify-content: flex-start; align-items: center; margin-top: 5px">
  <div style="display:flex;">
    <i
      class="mi mi-eye"
      style="font-size: 20px; align-self: center; margin-right: 5px; color: {Theme
        .PALETTE.gray}"></i>
    <span style="color: {Theme.PALETTE.gray}; font-weight:500"
      >{numberParsed(views)}</span>
  </div>

  {#if !justViews}
    <div style="display:flex; margin-left: 20px">
      <i
        class="mi mi-heart"
        style="font-size: 20px; align-self: center; margin-right: 5px; color: {Theme
          .PALETTE.gray}"></i>
      <span style="color: {Theme.PALETTE.gray}; font-weight:500"
        >{numberParsed(likes)}</span>
    </div>
  {/if}
</div>
