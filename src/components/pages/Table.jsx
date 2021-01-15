import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Fade, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { AuthStateContext } from '../../contexts/AuthContext'
import { TableDispatchContext, TableStateContext } from '../../contexts/TableContext'
import createHeaderMenu from '../header/Menu'
import createWelcomeDialog from '../notifications/WelcomeDialog'
import createTableLayout from '../misc/TableLayout'
import createCollectBetDialog from '../notifications/CollectBetDialog'
import { createGame } from '../../models/Game'
import { updateTable } from '../../services/tables'
import createActionsDialog from '../notifications/ActionsDialog'
import createPlayingCard from '../playingCards/PlayingCard'
import { GameDispatchContext, GameStateContext } from '../../contexts/GameContext'

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: 'center',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
    justifyContent: 'center',
  },
}))

const createTablePage = React => () => {
  const { t } = useTranslation()
  const classes = useStyles()
  const authState = useContext(AuthStateContext)
  const { did, isLoggedIn, player, table: playerTable } = authState
  // const setAuthContext = useContext(AuthDispatchContext)

  // state
  const [params] = useState({ headers: { authorization: `Bearer ${did}` } })
  const [table, setTable] = useState(playerTable)
  const [progress, setProgress] = useState('notStarted')
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [game, setGame] = useState(createGame(params)())
  const [bet, setBet] = useState(0)
  const [action, setAction] = useState()
  const [splits, setSplits] = useState(0)
  const actionProps = {
    dealerCards: game.dealerCards,
    isEarly: false,
    hand: Array.isArray(game.hands) && game.hands.length > 0 && game.hands[game.currentHand],
    open: isPlayerTurn,
    progress,
    rules: game.rules,
    setAction,
    setBet,
    setIsPlayerTurn,
    setProgress,
    setSplits,
    splits,
  }
  const [gameMeta, setGameMeta] = useState({ playingCards: [], positions: {} })
  
  // components
  const HeaderMenu = createHeaderMenu()
  const CollectBetDialog = createCollectBetDialog()
  const ActionsDialog = createActionsDialog()
  const TableLayout = createTableLayout()
  
  // effects
  const finishDealerHand = async () => {
    // get dealer's remaining cards
    const theGame = await table.completeDealersHand(game)
    actionProps.dealerCards = theGame.dealerCards
    const { playingCards } = gameMeta
    // deal them to the table
    for (let i = 2; i < theGame.dealerCards.length; i += 1) {
      const cardPos = {
        position: 'absolute',
        top: '14vh',
        left: `calc(50vh + ${(i - 1) * 130 + 10}px)`
      }
      const props = { ...theGame.dealerCards[i], owner: 'dealer' }
      const PlayingCard = createPlayingCard()
      playingCards.push(<PlayingCard {...props} width={120} style={cardPos} />)
    }
    const updatedCards = playingCards.map(c => ({ ...c, isFaceUp: true }))            
    setGameMeta({ ...gameMeta, playingCards: updatedCards })
  }
  /**
   * The "progress" effect is where we figure out the results of the
   * players' actions and move the game forward
   */
  useEffect(() => {
    (async () => {
      // handle game progress
      switch (progress) {
        case 'notStarted':
          console.log('game not started')
          setIsPlayerTurn(true)
          break
        case 'gameStarted':
          setIsPlayerTurn(true)
          break
        case 'cardsDealt':
          // if ALL the hands were dealt blackjack
          if (game.hands.every(h => h.isBlackjack())) {
            await finishDealerHand()
          } else if (false) {
            // if the DEALER has blackjack
            // TODO
          } else {
            // play resumes
            setIsPlayerTurn(true)
          }
          break
        case 'justHit':
          // evaluate the results of the hit; if total is now >= 21...
          if (game.hands[0].total() >= 21) {
            // the round is now over; if you didn't bust...
            if (!game.hands[0].isBust()) {
              // dealer has to finish
              await finishDealerHand()
            }
          }
          setIsPlayerTurn(true)
          break
        case 'justStood':
          await finishDealerHand()
          setIsPlayerTurn(true)
          break
        default:
          // hi
      }
    })()
  }, [progress]) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * The "action" effect is where we do most of the things
   * where PLAYERS make decisions, i.e. it responds to the
   * actions taken by a player
   */
  const startGame = async () => {
    setGame(await table.startGame(player, bet))
    player.chips = player.chips - bet
    // setAuthContext({ ...authState, player })
    const games = [...table.games, game._id]
    setTable(await updateTable(table, { games }, params))
    setProgress('gameStarted')
    console.log('gameStarted')
  }
  const dealCards = async () => {
    const theGame = await table.dealGame(game)
    actionProps.hand = theGame.hands[theGame.currentHand]
    actionProps.dealerCards = theGame.dealerCards
    setGame(theGame)
    // update UI with cards
    const { positions } = gameMeta
    const playingCards = []
    for (let i = 0; i < 2; i += 1) {
      for (let j = 0; j < theGame.hands.length + 1; j += 1 ) {
        // generate a playing card component
        const cardPos = { position: 'absolute' }
        const props = j === theGame.hands.length ? theGame.dealerCards[i] : theGame.hands[j].cards[i]
        if (j < theGame.hands.length) {
          // player cards
          const seat = `seat${j}`
          cardPos.top = i === 1
            ? (Math.round(+positions[seat].top) - 50) + 'px'
            : (Math.round(+positions[seat].top) - 10) + 'px'
          cardPos.left = i === 1
          ? (Math.round(+positions[seat].left) - 60) + 'px'
          : (Math.round(+positions[seat].left) - 10) + 'px'
        } else {
          // dealer cards
          cardPos.top = '14vh'
          cardPos.left = i === 0 ? 'calc(50vw - 130px)' : 'calc(50vw + 10px)'
        }
        const owner = j === theGame.hands.length ? 'dealer' : theGame.hands[j].player
        const PlayingCard = createPlayingCard()
        playingCards.push(<PlayingCard {...props} owner={owner} width={120} style={cardPos} />)
        // await sleep(1000)
      }
    }
    setGameMeta({ ...gameMeta, playingCards })
    setProgress('cardsDealt')
    console.log('cardsDealt')
  }
  const dealOneCard = async () => {
    // get the updated game object
    const theGame = await table.dealOneCard(game, game.hands[0].player)
    // update the game state
    setGame(theGame)
    // get the card that was just dealt (last one in the array)
    const card = theGame.hands[0].cards.slice(-1)
    const num = theGame.hands[0].cards.length
    // get and set position info
    const { playingCards, positions } = gameMeta
    const style = { 
      position: 'absolute',
      top: (Math.round(+positions['seat0'].top - ((num - 1) * 40 + 10))) + 'px',
      left: (Math.round(+positions['seat0'].top - ((num - 1) * 50 + 10))) + 'px'
    }
    const owner = theGame.hands[0].player
    const PlayingCard = createPlayingCard()
    playingCards.push(<PlayingCard { ...card } owner={owner} width={120} style={style} />)
    setGameMeta({ ...gameMeta, playingCards })
    setProgress('justHit')
    console.log('justHit')
  }
  useEffect(() => {
    // handle user action
    (async () => {
      switch (action) {
        case 'collectBet': setIsPlayerTurn(false); break
        case 'start': await startGame(); break
        case 'deal': setIsPlayerTurn(false); await dealCards(); break
        case 'stand': setIsPlayerTurn(false); setProgress('justStood'); break
        case 'hit': setIsPlayerTurn(false); await dealOneCard(); break
        case 'split':
          break
        case 'doubleDown':
          break
        case 'surrender':
          break
        case 'insure':
          break
        default:
          // hi
      }
    })()
  }, [action]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <TableStateContext.Provider value={table}>
      <TableDispatchContext.Provider value={setTable}>
        <HeaderMenu isLoggedIn={isLoggedIn} email={player.email} />
        <Paper className={classes.root} elevation={0}>
          {progress !== 'notStarted' &&
            <GameStateContext.Provider value={gameMeta}>
              <GameDispatchContext.Provider value={setGameMeta}>
                <Fade in={progress !== 'notStarted'}>
                  <Box>
                    <TableLayout game={game} />
                    {/* Play area */}
                    <div id="gameInfo" style={{
                      color: '#fff',
                      fontFamily: 'Raleway, sans-serif',
                      fontSize: '1rem',
                      position: 'absolute',
                      width: '180px',
                      left: 'calc(50vw - 90px)',
                      textAlign: 'center',
                      top: 'calc(100vh - 111px)',
                    }}>
                      {t('pages.table.current-total')}: {game.hands[0].isSoft() && t('pages.table.soft')} {game.hands[0].total() || '--'}<br />
                      {t('pages.table.current-bet')}: ${game.hands[0].bet || '0'}<br />
                      {t('pages.table.chips')}: ${player.chips}
                    </div>
                    {gameMeta.playingCards}
                  </Box>
                </Fade>
              </GameDispatchContext.Provider>
            </GameStateContext.Provider>
          }
          {/* Dialogs */}
          <ActionsDialog { ...actionProps } />
          {!player.name && createWelcomeDialog({ open: true })}
          <CollectBetDialog
            open={action === 'collectBet'}
            bet={bet}
            player={player}
            setBet={setBet}
            setAction={setAction}
          />
        </Paper>
      </TableDispatchContext.Provider>
    </TableStateContext.Provider>
  )
}

export default createTablePage
