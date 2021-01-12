import { Magic } from 'magic-sdk'
import { findPlayerByEmail } from './players'

const magic = new Magic(process.env.REACT_APP_PK_KEY)

export const checkUser = async cb => {
  const isLoggedIn = await magic.user.isLoggedIn()
  if (isLoggedIn) {
    const { email } = await magic.user.getMetadata()
    const did = await magic.user.getIdToken()
    const player = await findPlayerByEmail(email, did)
    return cb({ isLoggedIn, did, player })
  }
  return cb({ isLoggedIn, did: null, player: null })
}

export const loginUser = async email => {
  await magic.auth.loginWithMagicLink({ email })
}

export const logoutUser = async () => {
  await magic.user.logout()
}