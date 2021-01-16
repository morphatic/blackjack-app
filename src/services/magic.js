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
    const token = await magic.user.getIdToken()
    const player = await findPlayerByEmail(email, token)
    const table = await findTableByOwner(player._id, token)
    return cb({ isLoggedIn, token, player, table })
  }
  return cb({ isLoggedIn, token: null, player: null })
}

export const loginUser = async email => {
  await magic.auth.loginWithMagicLink({ email })
}

export const logoutUser = async () => {
  await magic.user.logout()
}