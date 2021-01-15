import { api } from "../services/api"
import { createGames } from "../services/games"
import { createHands, updateHand } from "../services/hands"
import { createDeck } from "./Deck"
import { createGame } from "./Game"
import { createHand } from "./Hand"

export const defaultRules = {
  seats: 5,
  decks: 6,
  minBet: 5,
  maxBet: 2000,
  betIncrement: 5,
  allowEarlySurrender: false,
  allowLateSurrender: false,
  allowableDoubleDownTotals: [9, 10, 11],
  numberOfSplitsAllowed: 3,
  allowSplitsForAll10Cards: true,
  allowDoublingAfterSplit: true,
  payoutForBlackjack: 1.5,
  dealPlayersCardsFaceDown: false,
  dealerStandsOnSoft17: true,
  fiveCardCharlieWins: false,
  insuranceAvailable: true,
  secondsAllowedPerAction: 30,
  canOnlyHitOnceAfterAceSplit: true,
}

export const createTable = params => ({
  deck = null,
  games = [],
  seat = 5, // I don't think we're going to use this, since it is a property of the game
  ...args
} = {}) => ({
  deck,
  games,
  seat,
  ...args,
  raw() { JSON.parse(JSON.stringify(this)) },
  gameInProgress() { return this.games[this.games.length - 1]?.isComplete || false },
  startGame: async function (player, bet) {
    // initialize a hand for each seat (raw() removes function props)
    const hands = await createHands([...Array(player.preferences.rules.seats)].map(h => createHand({ player, bet }).raw()), params)
    // use the decorator to create a new game with these hands
    const game = createGame(params)({ rules: player.preferences.rules, hands: hands.map(h => h._id), table: this._id })
    // update the hands so that they're associated with the new game
    const gameHands = await Promise.all(game.hands.map(async h => await updateHand(h, { game: game._id }, params)))
    console.log(gameHands)
    // submit the game to the API and apply the decorator to the returned result
    return createGames(game.raw(), params)
  },
  clearCards: async function () {
    // add the cards in play to the discard pile
    const discards = [...this.deck.discards, ...this.deck.inPlay]
    // update the DB
    const deck = await api.service('decks').patch(this.deck._id, { discards, inPlay: [] }, this.key)
    // replace the current deck with the updated one from the DB
    this.deck = createDeck(deck)
  },
  completeDealersHand: async function (theGame) {
    // send the request to the server
    const game = await api.service('decks').update(this.deck, { action: 'completeDealersHand', gameId: theGame._id }, params)

    // turn all the cards face up
    for (let i = 0; i < game.hands.length; i += 1) {
      game.hands[i].cards = game.hands[i].cards.map(c => ({ ...c, isFaceUp: true }))
    }
    // turn the dealer's cards face up
    game.dealerCards = game.dealerCards.map(c => ({ ...c, isFaceUp: true }))

    // return the decorated game
    return createGame(params)(game)
  },
  dealOneCard: async function (theGame, recipient) {
    // send the request to the server
    const { game } = await api.service('decks').update(this.deck, { action: 'dealOne', gameId: theGame._id, recipient }, params)

    // turn the appropriate cards face-up
    const i = game.hands.findIndex(h => h.player = recipient)
    game.hands[i].cards = game.hands[i].cards.map((c, i) => game.rules.dealPlayersCardsFaceDown && i <= 1 ? ({ ...c, isFaceUp: false }) : ({ ...c, isFaceUp: true }))

    // only the dealer's first card needs to be face up
    game.dealerCards[0].isFaceUp = true

    // decorate the hands
    game.hands = game.hands.map(h => createHand(h))
    
    // return the decorated game
    return createGame(params)(game)
  },
  dealGame: async function (theGame) {
    // send a request to the server to deal the necessary cards from the deck
    const { game } = await api.service('decks').update(this.deck, { action: 'deal', gameId: theGame._id }, params)

    // set the cards face up or face down as is appropriate (default is face down)
    if (!game.rules.dealPlayersCardsFaceDown) {
      for (let i = 0; i < game.hands.length; i += 1) {
        game.hands[i].cards = game.hands[i].cards.map(c => ({ ...c, isFaceUp: true }))
      }
    }
    // only the dealer's first card needs to be face up
    game.dealerCards[0].isFaceUp = true

    // decorate the hands
    game.hands = game.hands.map(h => createHand(h))
    
    // return the decorated game
    return createGame(params)(game)
  },
  settleAllHands: async function (theGame) {
    const deck = await api.service('decks').update(this.deck, { action: 'settleGame', gameId: theGame._id}, params)
    return deck
  }
})
