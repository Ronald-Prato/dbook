import { writable } from "svelte/store"
import { USERS } from "../entities"
import { gun, user } from "../gun"
import { decryptData } from "../utils/crypto-utils"

const currentUser = writable({
  uuid: "",
  nickname: "",
  books: {},
  photo: "",
})

const setCurrentUser = () => {
  gun.get(user.is.epub).once(async (_user) => {
    const user = await decryptData(_user.data)
    currentUser.set(user)
  })
}

export { currentUser, setCurrentUser }
