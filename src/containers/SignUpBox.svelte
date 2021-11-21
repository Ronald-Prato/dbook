<style>
.input-box {
  min-width: 400px;
  min-height: 300px;
  padding: 60px 40px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(160, 106, 211, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.form-container {
  width: 100%;
}
.input {
  width: 100%;
}
.buttons-section {
  margin-top: 5%;
  width: 100%;
  display: flex;
}
.button {
  outline: none;
  border: none;
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
}

.no-account-message {
  position: absolute;
  bottom: 5%;
  margin: 0 auto;
  color: #4a453d;
}

.no-account-message b {
  color: #f28b05;
  cursor: pointer;
}
.show-password-cta {
  color: #f28b05;
  cursor: pointer;
  font-weight: 400;
}
</style>

<script>
import { user } from "../gun"
import { Theme } from "../theme"
import { handleAuthResponse } from "../utils/gun-utils"

import { navigate } from "svelte-routing"
import { createUser } from "../service/user"
import { setCurrentUser } from "../store/users"
import { MAX_NICKNAME_LENGTH } from "../constants"

export let onChangeAuthOption = () => {}

let formState = { nickname: "", passphrase: "", repeatedPassphrase: "" }
let showPassword = false

const handleLogin = (option) => {
  user.auth(formState.nickname, formState.passphrase, async (response) => {
    const res = handleAuthResponse(response)
    if (res !== "error") {
      option === "create-user"
        ? await createUser(formState.nickname)
        : setCurrentUser()

      navigate("/home")
    }
  })
}

const handleSignup = () => {
  user.create(formState.nickname, formState.passphrase, (response) => {
    const res = handleAuthResponse(response)
    if (res !== "error") {
      handleLogin("create-user")
    }
  })
}

const validateForm = () => {
  if (
    !formState.nickname.trim().length ||
    !formState.passphrase.trim().length ||
    !formState.repeatedPassphrase.trim().length
  ) {
    alert("No puedes dejar campos vacíos")
    return
  }

  if (formState.nickname.trim().length < 4) {
    alert("Tu nickname debe tener al menos 4 caracteres")
    return
  }

  if (formState.passphrase !== formState.repeatedPassphrase) {
    alert("Las contraseñas no coinciden")
    return
  }

  handleSignup()
}

const togglePasswordVisibility = () => {
  if (!formState.passphrase.length) {
    return
  }
  showPassword = !showPassword
  document.getElementById("passphrase").type = showPassword
    ? "text"
    : "password"
  document.getElementById("passphrase-repeat").type = showPassword
    ? "text"
    : "password"
}

const handleShowLoginBox = () => {
  onChangeAuthOption()
}
</script>

<div class="input-box">
  <div class="form-container">
    <label for="nickname">Nombre de usuario</label>
    <input
      autocomplete="off"
      type="text"
      id="nickname"
      maxlength="{MAX_NICKNAME_LENGTH}"
      bind:value="{formState.nickname}"
      class="input" />

    <label for="passphrase">Contraseña</label>
    <input
      autocomplete="off"
      type="password"
      id="passphrase"
      bind:value="{formState.passphrase}"
      class="input" />

    <label for="passphrase-repeat">Repetir contraseña</label>
    <input
      autocomplete="off"
      type="password"
      id="passphrase-repeat"
      bind:value="{formState.repeatedPassphrase}"
      class="input" />

    <span on:click="{togglePasswordVisibility}" class="show-password-cta"
      >{!showPassword ? "Mostrar contraseña" : "Ocultar contraseña"}</span>
  </div>

  <div class="buttons-section">
    <button
      on:click="{validateForm}"
      class="button"
      style="background: {Theme.PALETTE.primary}">Registrarte</button>
  </div>
  <span class="no-account-message">
    ¿Ya tienes cuenta?
    <b on:click="{handleShowLoginBox}"> Inicia sesión </b>
  </span>
</div>
