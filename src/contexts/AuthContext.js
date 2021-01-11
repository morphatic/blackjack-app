import { createContext } from 'react'

/**
 * Contains a User object. Represents the logged-in player.
 */
export const AuthContext = createContext({ user: null })
