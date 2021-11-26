<style>
h2 {
  margin-bottom: 0;
  color: #f28b05;
}
section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.count-container {
  padding: 5px 10px;
  width: 100px;
  border-radius: 5px;
  margin-top: 10px;
  border: 1px solid #f28b05;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.count-container p {
  margin: 0;
  font-size: 18px;
  font-weight: bolder;
  color: #f28b05;
}
span {
  font-size: 12px;
}
</style>

<script>
import { gun } from "../gun"
import { USERS } from "../entities"

let userCount = {}

gun
  .get(USERS)
  .map()
  .on((_, key) => (userCount[key] = ""))
</script>

<section>
  <h2>Usuarios creados</h2>
  <div class="count-container">
    <span>🎉</span>
    <p>{Object.keys(userCount).length}</p>
    <span>🎉</span>
  </div>
</section>
