import { api } from './api'
import { createGame } from '../models/Game'
import { createHand } from '../models/Hand'


export const createGames = (game, params) => api.service('games')
  .create(game, params)
  .then(g => api.service('games').get(g._id, { ...params, query: { $populate: 'hands' } }))
  .then(g => ({...g, hands: g.hands.map(h => createHand(h)) })) // decorate the hands before passing along
  .then(g => createGame(params)(g))
  // .then(g => { console.log(g); return g })

// /**
//  * Finds a game by owner.
//  *
//  * @param   {string} owner _id of the player to be retrieved
//  * @param   {string} key   The DID string that authenticates the request
//  * @returns {object}       An object representing the player requested
//  */
// export const findGameByOwner = (owner, key) => {
//   const params = { query: { owner }, headers: { authorization: `Bearer ${key}` } }
//   return api.service('games')
//     .find(params)
//     .then(res => createGame({ headers: { authorization: `Bearer ${key}` } })(res.data[0]))
// }

export const updateGame = (game, props, params) =>  api.service('games')
    .patch(game._id, props, params)
    .then(g => api.service('games').get(g._id, { ...params, query: { $populate: 'hands' } }))
    .then(g => createGame(params)(g))
    .then(g => { console.log(g); return g })
