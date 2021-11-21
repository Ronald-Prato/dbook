import { gun, user } from "../gun"
import { encryptData, decryptData } from "../utils/crypto-utils"

export const generateGenericUserData = (date, nickname) => {
  return {
    followers: [],
    followed: [],
    books: {},
    photo: `https://avatars.dicebear.com/api/avataaars/${nickname}.svg`,
    createdAt: date,
    updatedAt: date,
  }
}

export const updateFollowers = (idToUpdate, callback) => {
  const userId = user.is.epub

  gun.get(idToUpdate).once(async (_userToUpdate) => {
    const userToUpdate = await decryptData(_userToUpdate.data)
    let userFollowers = userToUpdate.followers

    if (!userFollowers.includes(userId)) {
      // Add new follower
      userFollowers.push(userId)
    } else {
      // Remove follower
      userFollowers = userFollowers.filter((follower) => follower !== userId)
    }

    const userToUpdateNewData = await encryptData({
      ...userToUpdate,
      followers: userFollowers,
    })

    gun.get(idToUpdate).put({ data: userToUpdateNewData })
    callback()
  })
}
