import { createContext } from 'react'

export const defaultGameContext = {
  positions: [], // the { top: Npx, left: Mpx } coords of the seats at the table
}

export const GameStateContext = createContext(defaultGameContext)
export const GameDispatchContext = createContext()
