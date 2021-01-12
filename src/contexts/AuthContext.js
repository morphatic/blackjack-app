import { createContext } from 'react'

export const defaultAuthContext = {
  did: null,
  isLoggedIn: false,
  player: null,
}

/**
 * Contains a User object. Represents the logged-in player.
 */
export const AuthStateContext = createContext(defaultAuthContext)
export const AuthDispatchContext = createContext()
