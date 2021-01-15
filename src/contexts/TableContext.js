import { createContext } from 'react'
import { createTable } from '../models/Table'

export const defaultTableContext = createTable()

export const TableStateContext = createContext(defaultTableContext)
export const TableDispatchContext = createContext()
