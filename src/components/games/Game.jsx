import { useState } from 'react'
import { defaultGameContext, GameDispatchContext, GameStateContext } from '../../contexts/GameContext'


export const createGame = React => (props) => {
  const [game, setGame] = useState(defaultGameContext)
    
  return (
    <GameStateContext.Provider value={game}>
      <GameDispatchContext.Provider value={setGame}>
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  )
}

export default createGame
