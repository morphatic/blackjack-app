import { cloneElement, useContext, useEffect, useState } from "react"
import isEqual from 'lodash/fp/isEqual'
import { Box, Fade } from "@material-ui/core"
import { AuthStateContext } from "../../contexts/AuthContext"
import { createGame } from "../../models/Game"
import { createHand } from "../../models/Hand"
// import { findPlayerByEmail } from '../../services/players'
import gameController from '../../controllers/game'
import createActionsDialog from '../notifications/ActionsDialog'
import createCollectBetDialog from '../notifications/CollectBetDialog'
import createGamePage from "./Game"
import createHeaderMenu from '../header/Menu'
import createPlayingCard from '../playingCards/PlayingCard'
import createWelcomeDialog from '../notifications/WelcomeDialog'
import createAlert from "../notifications/Alert"
import { useTranslation } from "react-i18next"

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const createTablePage = React => props => {
  const { t } = useTranslation()
  // Context
  const authState = useContext(AuthStateContext)
  const { token, isLoggedIn, player } = authState
  // const setAuthContext = useContext(AuthDispatchContext)
  // const updatePlayer = async () => {
  //   const p = await findPlayerByEmail(player.email, token)
  //   setAuthContext(authState => ({ ...authState, player: p }))
  // }

  // default game; prevents some initial states from being undefined
  const gameDefaults = createGame({ hands: [createHand({ player })] })
  
  // State
  const [action, setAction] = useState()
  const [bet, setBet] = useState(0)
  const [game, setGame] = useState(gameDefaults)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [params] = useState({ headers: { authorization: `Bearer ${token}` } })
  const [playingCards, setPlayingCards] = useState([])
  const [result, setResult] = useState({ message: '', severity: '' })
  const [seatPositions, setSeatPositions] = useState({})
  const [splits, setSplits] = useState(0)
  const [actionProps, setActionProps] = useState({
    dealerCards: [],      // for determining whether insurance/surrender available
    isEarly: false,       // used in conjunction with allow early/late surrender
    hand: createHand(),   // sets sensible defaults; see src/models/Hand.js
    open: isPlayerTurn,   // opens the dialog when it's the player's turn
    progress: game.state, // helps determine which actions should be available
    rules: game.rules,    // ditto
    setAction,            // mechanism for the dialog to advance play
    setBet,               // used to partially trigger collect bet dialog to open
    splits,               // helps determine which actions should be available
  })

  // the game controller sends and receives all game actions and updates from the API
  const controller = gameController(params)

  // utility functions and variables
  const cardWidth = 120
  // TODO: modify this to take into account the angle offset for the hand
  const cardPosition = (pos, num) => ({
    position: 'absolute',
    // transition: '0.5s',
    top: (Math.round(+pos.top) - (num * 20 + 10)) + 'px',
    left: (Math.round(+pos.left) - (num * 20 + 10)) + 'px',
    // transform: pos.transform,
  })
  const splitCardPosition = (pos, num) => ({
    position: 'absolute',
    // transition: '0.5s',
    top: (Math.round(+pos.top) - (num * 20 + 10)) + 'px',
    left: (Math.round(+pos.left) - (num * 20 + 10) + cardWidth + 30) + 'px',
    // transform: pos.transform,
  })
  const dealerCardPosition = num => ({
    position: 'absolute',
    top: '14vh',
    left: `calc(50vw + ${((num - 1) * (cardWidth + 10))}px - 20px)`,
  })
  
  // UI Management Functions
  /**
   * The startGame() method runs AFTER controller.start() has returned
   * and update the game state. It causes the initial deal to be updated
   * on the screen
   */
  const startGame = async () => {
    // make sure player action options are updated
    const hand = game.hands[game.currentHand]
    const dealerCards = game.dealerCards
    setActionProps(actionProps => ({ ...actionProps, hand, dealerCards }))
    // await updatePlayer()
    // update UI with cards
    for (let i = 0; i < 2; i += 1) {
      for (let j = 0; j <= game.hands.length; j += 1 ) {
        // generate a playing card component
        const props = j === game.hands.length ? game.dealerCards[i] : game.hands[j].cards[i]
        const style = j < game.hands.length ? cardPosition(seatPositions[`seat${j}`], i) : dealerCardPosition(i) 
        const owner = j === game.hands.length ? 'dealer' : game.hands[j].player._id
        const PlayingCard = createPlayingCard()
        setPlayingCards(playingCards => [
          ...playingCards,
          <PlayingCard key={props._id || props} id={props._id || props} {...props} owner={owner} width={120} style={style} />
        ])
        await sleep(250)
      }
    }
    console.log('started')
  }
  // TODO: FIX THIS!!!
  /**
   * advanceGame() gets called when a player stands. It takes stock of the
   * current game situation and moves it along to the next logical step.
   */
  const advanceGame = async () => {
    // make sure player action options are updated
    const hand = game.hands[game.currentHand]
    const dealerCards = game.dealerCards
    setActionProps(actionProps => ({ ...actionProps, hand, dealerCards, }))
    if (game.currentHand >= game.hands.length) {
      // everyone has played their hand
      game.state = 'finished'
      setAction('finish')
    } else {
      // it's the next person's turn; highlight the next hand
      game.state = 'reset'
      setAction('reset')
    }
  }
  /**
   * dealOneCard() is called AFTER a request to controller.deal() has been
   * resolved and written to the state. It takes care of updating the UI
   * with the new card.
   */
  const dealOneCard = async () => {
    // make sure player action options are updated
    const hand = game.hands[game.currentHand]
    const dealerCards = game.dealerCards
    setActionProps(actionProps => ({ ...actionProps, hand, dealerCards, }))
    // get the card that was just dealt (last one in the array)
    const props = game.hands[game.currentHand].cards.slice(-1)[0]
    // get and set position info
    let style
    if (hand.isSplit && game.currentHand === 0) {
      style = splitCardPosition(seatPositions[`seat${game.currentHand}`], game.hands[game.currentHand].cards.length - 1)
    } else {
      style = cardPosition(seatPositions[`seat${game.currentHand}`], game.hands[game.currentHand].cards.length - 1)
    }
    const owner = game.hands[game.currentHand].player._id
    const PlayingCard = createPlayingCard()
    setPlayingCards(playingCards => [
      ...playingCards,
      <PlayingCard key={props._id} id={props._id} { ...props } owner={owner} width={120} style={style} />
    ])
    // reset the state and action in case we want to hit again
    setAction('reset')
    game.state = 'reset'
    console.log('justHit')
  }
  /**
   * splitHand() is called AFTER a request to controller.split() has been
   * resolved and written to the state. It takes the result of the split
   * and updates the cards arranged on the screen.
   */
  const splitHand = async () => {
    // make sure player action options are updated
    const hand = game.hands[game.currentHand]
    const dealerCards = game.dealerCards
    setActionProps(actionProps => ({ ...actionProps, hand, dealerCards, }))
    // await updatePlayer()
    setSplits(splits => splits + 1)
    // for this we have to re-lay out the original hand plus the new one
    // also need to highlight the one to be played next (the one to the right)
    // move the bottom card over to the right
    let index = playingCards.findIndex(c => isEqual(c.props.id, game.hands[game.currentHand].cards[0]._id))
    playingCards[index] = cloneElement(playingCards[index], {
      style: {
        position: 'absolute',
        left: (parseInt(playingCards[index].props.style.left.replace(/\D/g, '')) + 150) + 'px',
        top: playingCards[index].props.style.top,
      },
    })
    await sleep(250)
    // move the top card down
    index = playingCards.findIndex(c => isEqual(c.props.id, game.hands[game.currentHand + 1].cards[0]._id))
    playingCards[index] = cloneElement(playingCards[index], {
      style: {
        position: 'absolute',
        left: (parseInt(playingCards[index].props.style.left.replace(/\D/g, '')) + 20) + 'px',
        top: (parseInt(playingCards[index].props.style.top.replace(/\D/g, '')) + 20) + 'px',
      }
    })
    await sleep(250)
    // add the new cards
    // second card in the first split hand
    let props = game.hands[game.currentHand].cards[1]
    let PlayingCard = createPlayingCard()
    let style = splitCardPosition(seatPositions[`seat${game.currentHand}`], 1)
    const owner = game.hands[game.currentHand].player._id
    setPlayingCards(playingCards => [
      ...playingCards,
      <PlayingCard key={props._id} id={props._id} { ...props } owner={owner} width={cardWidth} style={style} />
    ])
    await sleep(250)
    // second card in the second split hand
    props = game.hands[game.currentHand + 1].cards[1]
    PlayingCard = createPlayingCard()
    style = cardPosition(seatPositions[`seat${game.currentHand}`], 1)
    setPlayingCards(playingCards => [
      ...playingCards,
      <PlayingCard key={props._id} id={props._id} { ...props } owner={owner} width={cardWidth} style={style} />
    ])
    console.log('justSplit')
  }
  /**
   * doubleDown() updates the UI AFTER a call to controller.doubleDown()
   */
  const doubleDown = async () => {
    // make sure player action options are updated
    const hand = game.hands[game.currentHand]
    const dealerCards = game.dealerCards
    setActionProps(actionProps => ({ ...actionProps, hand, dealerCards, progress: 'doubled' }))
    // await updatePlayer()
    console.log('justDoubledDown')
  }
  /**
   * surrender() updates the UI AFTER a call to controller.surrender()
   */
  const surrender = async () => {
    // make sure player action options are updated
    const hand = game.hands[game.currentHand]
    const dealerCards = game.dealerCards
    setActionProps(actionProps => ({ ...actionProps, hand, dealerCards, }))
    // await updatePlayer()
    console.log('justSurrendered')
  }
  /**
   * insure() updates the UI AFTER a call to controller.insure()
   */
  const insure = async () => {
    // make sure player action options are updated
    const hand = game.hands[game.currentHand]
    const dealerCards = game.dealerCards
    setActionProps(actionProps => ({ ...actionProps, hand, dealerCards, }))
    // await updatePlayer()
    console.log('justInsured')
  }
  /**
   * finishDealerHand() updates the UI with the dealer's remaining cards
   * following the resolution of a call to controller.completeDealersHand()
   */
  const finishDealerHand = async () => {
    // make sure player action options are updated
    const hand = game.hands[game.currentHand]
    const dealerCards = game.dealerCards
    setActionProps(actionProps => ({ ...actionProps, hand, dealerCards, }))
    // deal them to the table
    for (let i = 1; i < game.dealerCards.length; i += 1) {
      const cardPos = dealerCardPosition(i)
      const props = { ...game.dealerCards[i], owner: 'dealer' }
      const PlayingCard = createPlayingCard()
      if (i === 1) {
        // replace the hole card
        const index = playingCards.findIndex(c => isEqual(c.props.id, game.dealerCards[i]._id))
        playingCards[index] = cloneElement(playingCards[index], props)
        setPlayingCards(playingCards)
      } else {
        setPlayingCards(playingCards => [
          ...playingCards,
          <PlayingCard key={props._id} id={props._id} {...props} width={120} style={cardPos} />
        ])
      }
      await sleep(250)
    }
    setAction('settle')
    console.log('justFinishedDealerHand')
  }
  /**
   * showResults() updates the UI with the results of each hand showing which
   * hands won, lost, pushed, etc. and the updated chip totals after bets
   * have been settled. It stops at that point to give the player time to
   * view the results before the user cleaning up. This happens after a call
   * to controller.settleGame() has resolved
   */
  const showResults = async () => {
    // get the result (for the first hand)
    const hand = game.hands[0]
    const result = hand.result
    // construct the appropriate message
    let msg = ''
    let severity = ''
    if (result === 'w') {
      msg = 'You won!'
      severity = 'success'
    } else if (result === 'b') {
      msg = 'Blackjack! Woohoo!!!'
      severity = 'success'
    } else if (result === 'i') {
      msg = 'You lost, but you bought insurance, so it was a wash.'
      severity = 'info'
    } else if (result === 'p') {
      msg = 'You tied with the dealer. Meh.'
      severity = 'info'
    } else if (result === 'l') {
      msg = 'Sorry, you lost.'
      severity = 'error'
    } else {
      msg = 'You surrendered... so, um, yeah.'
      severity = 'warning'
    }
    setResult({ message: msg, severity })

    await sleep(1000)
  }
  /**
   * cleanup() is called when the user clicks the "Clean Up" button. It is after
   * they've had a chance to view the results. This removes all the cards from
   * the UI and prepares the board for the next round.
   */
  const cleanup = async () => {
    // remove all the cards
    setPlayingCards(playingCards => [])
    setAction('')
    setResult({ message: '', severity: '' })
    game.state = 'notStarted'
  }

  /**
   * The Effects--Game and Action
   * 
   * Below are two useEffect hooks that serve as an alternating locus of control
   * for what's going on the game. Since game actions depend upon having an updated
   * version of the game, one effect (action) is responsible for calling setGame
   * and triggering one of the (async) controller methods to update game state.
   * The other effect responds to those changes to move game play forward, setting
   * the locus of control back to the player, if necessary. Player actions get
   * disabled when the game state is updating.
   */
  useEffect(() => {
    (async () => {
      console.log('Game state:', game.state)
      switch (game.state) {
        case 'notStarted':  /* show Start button */   setIsPlayerTurn(true); break
        case 'betting':     /* bet dialog opens */                           break
        case 'started':     await startGame();        setIsPlayerTurn(true); break
        case 'stood':       await advanceGame();      setIsPlayerTurn(true); break
        case 'hit':         await dealOneCard();      setIsPlayerTurn(true); break
        case 'split':       await splitHand();        setIsPlayerTurn(true); break
        case 'doubled':     await doubleDown();       setIsPlayerTurn(true); break
        case 'surrendered': await surrender();                               break
        case 'insured':     await insure();           setIsPlayerTurn(true); break
        case 'finished':    await finishDealerHand();                        break
        case 'settled':     await showResults();      setIsPlayerTurn(true); break
        case 'cleaned':     await cleanup();                                 break
        default:            /* do nothing */
      }
    })()
  }, [game.state]) // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    // handle user action
    (async () => {
      const handId = game.hands[game.currentHand]?._id || null
      console.log('Action:', action)
      !!action && setIsPlayerTurn(false)
      let g
      switch (action) {
        case 'bet':       g = { ...game, state: 'betting'}              ; setGame(game => ({ ...game, ...g })); break
        case 'start':     g = await controller.start(player._id, [bet]) ; setGame(game => ({ ...game, ...g })); break
        case 'stand':     g = await controller.advance(game)            ; setGame(game => ({ ...game, ...g })); break
        case 'hit':       g = await controller.dealOne(game, handId)    ; setGame(game => ({ ...game, ...g })); break
        case 'split':     g = await controller.split(game, handId)      ; setGame(game => ({ ...game, ...g })); break
        case 'double':    g = await controller.doubleDown(game, handId) ; setGame(game => ({ ...game, ...g })); break
        case 'surrender': g = await controller.surrender(game, handId)  ; setGame(game => ({ ...game, ...g })); break
        case 'insure':    g = await controller.insure(game, handId)     ; setGame(game => ({ ...game, ...g })); break
        case 'finish':    g = await controller.completeDealersHand(game); setGame(game => ({ ...game, ...g })); break
        case 'settle':    g = await controller.settleGame(game)         ; setGame(game => ({ ...game, ...g })); break
        case 'cleanup':   g = { ...gameDefaults, state: 'cleaned' }     ; setGame(game => ({ ...game, ...g })); break
        default:            /* do nothing */
      }
    })()
  }, [action, setGame]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setActionProps(actionProps => ({ ...actionProps, open: isPlayerTurn, progress: game.state }))
    console.log('isPlayerTurn:', isPlayerTurn)
  }, [isPlayerTurn]) // eslint-disable-line react-hooks/exhaustive-deps

  // components
  const ActionsDialog = createActionsDialog()       // prompts player to take an action
  const CollectBetDialog = createCollectBetDialog() // dialog to collect bet(s) at beginning of game
  const Game = createGamePage()
  const HeaderMenu = createHeaderMenu()             // header menu
  const ResultsAlert = createAlert()
  const WelcomeDialog = createWelcomeDialog()       // welcome dialog; only on first login

  const gameProps = { game, playingCards, seatPositions, setSeatPositions }

  return (
    <Box>
      <HeaderMenu isLoggedIn={isLoggedIn} email={player.email} />
      <Game { ...gameProps } />
      <Fade in={Object.keys(seatPositions).length > 0}>
        <Box>
          {playingCards}
        </Box>
      </Fade>
      {/* Dialogs */}
      <ActionsDialog { ...actionProps } />
      {!player.name && <WelcomeDialog open={true} />}
      <CollectBetDialog
        open={action === 'bet'}
        bet={bet}
        player={player}
        setBet={setBet}
        setAction={setAction}
      />
      <ResultsAlert
        message={result.message}
        severity={result.severity}
        title={t('pages.table.result')}
      />
    </Box>
  )
}

export default createTablePage