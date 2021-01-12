import { createContext } from 'react'
import { createGame } from '../models/Game'

export const defaultGameContext = createGame()

export const GameStateContext = createContext(defaultGameContext)
export const GameDispatchContext = createContext()
