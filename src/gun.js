import Gun from "gun/gun"
import "gun/sea"
import "gun/axe"

const relayPeer =
  process.env.ENV === "DEVELOP"
    ? "http://localhost:3030/gun"
    : process.env.RELAY_SERVER_URL

const gun = Gun([relayPeer])
const user = gun.user().recall({ sessionStorage: true })

export { gun, user }
