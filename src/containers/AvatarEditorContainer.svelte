<style>
.edit-avatar-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.edit-photo-cta {
  color: steelblue;
  font-size: 14px;
  margin: 0;
  cursor: pointer;
  font-weight: 500;
}
.save-photo {
  color: #2dd665;
  font-size: 14px;
  margin: 0 0 0 10px;
  cursor: pointer;
  font-weight: 500;
}
.photo-container {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}
.cta-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 12px;
}
</style>

<script>
import { v4 as uuidv4 } from "uuid"
import { updateUserPhoto } from "../service/user"

export let photo
export let isOwn
let hasChangedAvatar

const handlePhotoChange = () => {
  hasChangedAvatar = true
  const newSeed = uuidv4()
  photo = `https://avatars.dicebear.com/api/avataaars/${newSeed}.svg`
}

const handleSaveNewAvatar = () => {
  updateUserPhoto(photo)
  hasChangedAvatar = false
}
</script>

<div class="edit-avatar-container">
  <div class="photo-container">
    <img src="{photo}" alt="user avatar" />
  </div>
  {#if isOwn}
    <div class="cta-wrapper">
      <p on:click="{handlePhotoChange}" class="edit-photo-cta">
        Cambiar avatar
      </p>
      {#if hasChangedAvatar}
        <p on:click="{handleSaveNewAvatar}" class="save-photo">Guardar</p>
      {/if}
    </div>
  {/if}
</div>
