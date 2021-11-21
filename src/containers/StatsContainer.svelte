<style>
.stats-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.stats-container {
  width: 100%;
  max-width: 500px;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.stat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h2 {
  font-size: 18px;
  margin: 0;
}
span {
  font-size: 14px;
  margin: 0;
  font-weight: bolder;
}
</style>

<script>
import { numberParsed } from "../utils/string-utils"

export let storiesNumber = 0
export let followersNumber = 0
export let followedNumber = 0
</script>

<div class="stats-wrapper">
  <ul class="stats-container">
    <li class="stat-container">
      <h2>Historias</h2>
      <span>{storiesNumber}</span>
    </li>

    <li class="stat-container">
      <h2>Seguidores</h2>
      <span>{numberParsed(followersNumber)}</span>
    </li>

    <li class="stat-container">
      <h2>Seguidos</h2>
      <span>{numberParsed(followedNumber)}</span>
    </li>
  </ul>
</div>
