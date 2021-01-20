/**
 * @module src/controllers/game.js
 * 
 * This is the master game controller that manages the flow of
 * play as well as communication to/from the API.
 */

import { Magic } from 'magic-sdk'
import { createGame } from "../models/Game"
import { createHand } from "../models/Hand"
import { api } from "../services/api"


/**
 * Factory function that creates a new game controller
 *
 * @param   {object} params Authentication params for connecting to the API
 * @returns {object}        A game controller object
 */
export const gameController = params => ({

  /**
   * Starts a new game.
   *
   * @param   {Player}   playerId The id of the player starting the game
   * @param   {number[]} bets     The amount(s) the player has decided to bet for this game (also determines number of seats)
   * @param   {object}   rules    (Optional) A set of rules for the game different than those for the player
   * @returns {Game}              The Game object that was created
   */
  async start (playerId, bets, rules = {}) {
    try {
      // request a new game from the api
      const game = await api.service('game').create({ playerId, bets, rules }, params)
  
      // hydrate the hands with the decorator
      game.hands = game.hands.map(h => createHand(h))
  
      // return the decorated game
      return createGame(game)
    } catch (error) {
      if (error.code === 401) {
        // token expired, try to refresh
        const m = new Magic(process.env.REACT_APP_PK_KEY)
        try {
          const isLoggedIn = await m.user.isLoggedIn()
          if (isLoggedIn) {
            // good, we're ok
            const token = await m.user.getIdToken()
            // reset the params
            this.params = { headers: { authorization: `Bearer ${token}` } }
            // retry this request
            return await this.start(playerId, bets, rules)
          }
        } catch (error) {
          console.log('There was a problem starting the game: ', error.message)
        }
      }
      console.log('There was a problem starting the game: ', error.message)
    }
  },

  /**
   * Advances the current hand being played
   *
   * @param {Game} theGame The game to be advanced
   */
  async advance (theGame) {
    try {
      // tell the server we'd like to move to the next hand
      const game = await api.service('game').update(theGame._id, { action: 'advance' }, params)
  
      // update the game with the next current hand and seat
      theGame.currentHand = game.currentHand
      theGame.currentSeat = game.currentSeat

      // if the game was finished
      if (game.state === 'finished') {
        // make sure to update the dealer cards
        theGame.dealerCards = game.dealerCards
      }

      // get the state
      theGame.state = game.state
    } catch (error) {
      console.log('There was a problem advancing the game: ', error.message)
    }  
    // return the game
    return theGame
  },

  /**
   * Splits a hand on the table.
   *
   * @param   {Game}     theGame The game in which a hand is being split
   * @param   {ObjectId} hand    The hand that is to be split
   * @returns {Game}             The updated game
   */
  async split (theGame, hand) {
    try {
      const { game/*, player*/ } = await api.service('game').update(theGame._id, { action: 'split', handId: hand }, params)
  
      // replace the dealer's first card with the hydrated one we already had
      game.dealerCards[0] = theGame.dealerCards[0]
  
      // decorate the hands
      game.hands = game.hands.map(h => createHand(h))
      
      // return the decorated game
      return createGame(game)
    } catch (error) {
      console.log('There was a problem splitting the hand: ', error.message)
      return theGame
    }
  },

  /**
   * Deals one card to a specific hand on the table.
   *
   * @param   {Game}     theGame The game into which a new card is to be dealt
   * @param   {ObjectId} hand    The hand that is to receive the card
   * @returns {Game}             The updated game
   */
  async dealOne (theGame, hand) {
    try {
      const game = await api.service('game').update(theGame._id, { action: 'deal', handId: hand }, params)
  
      // replace the dealer's first card with the hydrated one we already had
      game.dealerCards[0] = theGame.dealerCards[0]
  
      // decorate the hands
      game.hands = game.hands.map(h => createHand(h))
      
      // return the decorated game
      return createGame(game)
    } catch (error) {
      console.log('There was a problem dealing a card: ', error.message)
      return theGame
    }
  },

  /**
   * When it's the dealer's turn to play, this draws cards on
   * behalf of the dealer following the rules of this game.
   *
   * @param {Game} theGame The game with a dealer who is ready to finish their hand
   */
  async completeDealersHand (theGame) {
    try {
      // send a request to the api to finish the dealer's hand
      const game = await api.service('game').update(theGame._id, { action: 'completeDealersHand' }, params)
  
      // get the dealer's cards from the game object returned
      theGame.dealerCards = game.dealerCards

      // set the state
      theGame.state = game.state
    } catch (error) {
      console.log('The dealer\'s hand could not be completed: ', error.message)
    }
    // return the decorated game
    return theGame
  },

  /**
   * Figures out and updates the result of each hand and updates the
   * chip balance for all of the players
   *
   * @param {Game} theGame The game to be settled
   */
  async settleGame (theGame) {
    try {
      // send a request to the api to settle the game
      const game = await api.service('game').update(theGame._id, { action: 'settleGame' }, params)
  
      // decorate the hands
      game.hands = game.hands.map(h => createHand(h))

      // set the game state
      game.state = 'settled'

      // return the decorated game
      return createGame(game)    
    } catch (error) {
      console.log('There was a problem settling the game: ', error.message)
      return theGame
    }    
  },

  /**
   * Doubles down on a hand
   *
   * @param   {Game}     game   The game for which a hand is being doubled down
   * @param   {ObjectId} handId The id of the hand to be doubled
   * @returns {Game}            The game with the doubled down hand
   */
  async doubleDown (game, handId) {
    try {
      // make an api request to mark the hand as doubled
      const hand = await api.service('hands').patch(handId, { isDoubled: true }, params)
      // figure out which hand it was
      const index = game.hands.findIndex(h => h._id === hand._id)
      // replace the populated player field with just the player's id
      hand.player = hand.player._id
      // update the isDoubled property of that hand
      game.hands[index].isDoubled = true
      // set the game state
      game.state = 'doubled'
    } catch (error) {
      console.log(error)
      console.log('The hand could not be doubled')
   }
    // return the game
    return game
  },

  /**
   * Insures a hand
   *
   * @param   {Game}     game   The game for which a hand is being insured
   * @param   {ObjectId} handId The id of the hand to be insured
   * @returns {Game}            The game with the insured hand
   */
  async insure (game, handId) {
    try {
      // make an api request to mark the hand as insured
      const hand = await api.service('hands').patch(handId, { isInsured: true }, params)
      // figure out which hand it was
      const index = game.hands.findIndex(h => h._id === hand._id)
      // replace the populated player field with just the player's id
      hand.player = hand.player._id
      // update the isInsured property of that hand
      game.hands[index].isInsured = true
      // set the game state
      game.state = 'insured'
    } catch (error) {
       console.log(error)
       console.log('The hand could not be insured')
    }
    // return the game
    return game
  },

  /**
   * Surrenders a hand
   *
   * @param   {Game}     game   The game for which a hand is being surrendered
   * @param   {ObjectId} handId The id of the hand to be surrendered
   * @returns {Game}            The game with the surrendered hand
   */
  async surrender (game, handId) {
    try {
      // make an api request to mark the hand as surrendered
      const hand = await api.service('hands').patch(handId, { surrendered: true }, params)
      // figure out which hand it was
      const index = game.hands.findIndex(h => h._id === hand._id)
      // update the surrendered property of that hand
      game.hands[index].surrendered = true
      // set the game state
      game.state = 'surrendered'
    } catch (error) {
       console.log(error)
       console.log('The hand could not be surrendered')
    }
    // return the game
    return game
  },
})

export default gameController
