import { USERS } from "../entities"
import { gun, user } from "../gun"
import { currentUser, setCurrentUser } from "../store/users"
import { decryptData, encryptData } from "../utils/crypto-utils"
import { generateGenericUserData } from "../utils/user-utils"

const updateUserField = (field, data) => {
  const userId = user.is.epub
  gun.get(userId).once(async (_user) => {
    const user = await decryptData(_user.data)
    const newData = await encryptData({
      ...user,
      [field]: data,
    })

    gun.get(userId).put({
      data: newData,
    })
    setCurrentUser()
  })
}

export const createUser = async (nickname) => {
  const newUserId = user.is.epub

  const genericUserData = generateGenericUserData(
    new Date().getTime(),
    nickname
  )
  const userData = await encryptData({
    uuid: newUserId,
    nickname,
    ...genericUserData,
  })
  const newUser = gun.get(newUserId).put({
    data: userData,
  })

  gun.get(USERS).set(newUser)
  setCurrentUser()
}

export const logoutUser = () => {
  user.leave()
}

export const updateUserPhoto = (newPhoto) => {
  updateUserField("photo", newPhoto)
}

export const updateUserNickname = (newNickname) => {
  updateUserField("nickname", newNickname)
}
