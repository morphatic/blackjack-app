import { api } from './api'
import { createHand } from '../models/Hand'


/**
 * Finds hands by player and game.
 *
 * @param   {string} player _id of the player whose hands will be retrieved
 * @param   {string} game   _id of the game for which hands will be retrieved
 * @param   {string} token  The DID token string that authenticates the request
 * @returns {object}        An object representing the hand requested
 */
export const findHandsByPlayerAndGame = (player, game, token) => {
  const params = { query: { player, game }, headers: { authorization: `Bearer ${token}` } }
  return api.service('hands')
    .find(params)
    .then(({ data }) => data.map(h => createHand(h)))
}

export const updateHand = (hand, props, params) =>  api.service('hands')
    .patch(typeof hand === 'string' ? hand : hand._id, props, params)
    .then(h => createHand(h))
    // .then(h => { console.log(h); return h })

/**
 * Create hands in the remote database from one or more locally generated Hand
 * objects. Always returns an array of decorated or "raw" Hand objects.
 *
 * @param   {Hand|Hand[]} hands  Hand or array of Hands created by the local decorator
 * @param   {object}      params Authorization header info for making API requests
 * @param   {boolean}     raw    Indicates whether or not to return decorated Hand results
 * @returns {Hand[]}             Array of decorated or "raw" Hand objects
 */
export const createHands = (hands, params, raw = true) =>  api.service('hands')
    .create(hands, params)
    .then(h => {
      if (Array.isArray(h)) {
        return raw ? h : h.map(a => createHand(a))
      } else {
        return raw ? [h] : [ createHand(h) ]
      }
    })
    // .then(h => { console.log(h); return h })
