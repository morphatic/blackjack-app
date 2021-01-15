import { Magic } from 'magic-sdk'
import { findPlayerByEmail } from './players'
import { findTableByOwner } from './tables'

const magic = new Magic(process.env.REACT_APP_PK_KEY)

export const checkUser = async (oldLoginState, cb) => {
  const isLoggedIn = await magic.user.isLoggedIn()
  if (isLoggedIn === oldLoginState) {
    return
  }
  if (isLoggedIn) {
    const { email } = await magic.user.getMetadata()
    const did = await magic.user.getIdToken()
    const player = await findPlayerByEmail(email, did)
    const table = await findTableByOwner(player._id, did)
    return cb({ isLoggedIn, did, player, table })
  }
  return cb({ isLoggedIn, did: null, player: null })
}

export const loginUser = async email => {
  await magic.auth.loginWithMagicLink({ email })
}

export const logoutUser = async () => {
  await magic.user.logout()
}