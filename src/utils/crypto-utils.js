import { SEA } from "gun"

const pair = {
  pub: process.env.PUB_KEY,
  priv: process.env.PRIV_KEY,
  epub: process.env.EPUB_KEY,
  epriv: process.env.EPRIV_KEY,
}

export const encryptData = async (data) => {
  try {
    const enc = await SEA.encrypt(data, pair)
    const signedData = await SEA.sign(enc, pair)
    return signedData
  } catch (err) {
    console.log(err)
    return null
  }
}

export const decryptData = async (data) => {
  try {
    const verification = await SEA.verify(data, pair.pub)
    const decrypted = await SEA.decrypt(verification, pair)
    return decrypted
  } catch (err) {
    console.log(err)
    return null
  }
}
