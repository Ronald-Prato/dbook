import Gun from "gun/gun"
import "gun/sea"
import "gun/axe"

const relayPeer = process.env.RELAY_SERVER_URL
const gun = Gun([relayPeer])
const user = gun.user().recall({ sessionStorage: true })

export { gun, user }
