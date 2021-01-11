import { Magic } from 'magic-sdk'
const magic = new Magic(process.env.REACT_APP_PK_KEY)

export const checkUser = async cb => {
  const isLoggedIn = await magic.user.isLoggedIn()
  if (isLoggedIn) {
    const user = await magic.user.getMetadata()
    console.log(user)
    return cb({ isLoggedIn, email: user.email })
  }
  return cb({ isLoggedIn })
}

export const loginUser = async email => {
  await magic.auth.loginWithMagicLink({ email })
}

export const logoutUser = async () => {
  await magic.user.logout()
}