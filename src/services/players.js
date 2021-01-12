import { api } from './api'
import { createPlayer } from '../models/Player'


/**
 * Finds a player by email.
 *
 * @param   {string} email Email of the player to be retrieved
 * @param   {string} key   The DID string that authenticates the request
 * @returns {object}       An object representing the player requested
 */
export const findPlayerByEmail = (email, key) => {
  const params = { query: { email }, headers: { authorization: `Bearer ${key}` } }
  return api.service('players')
    .find(params)
    .then(res => createPlayer(res.data[0]))
}

export const updatePlayer = (player, props, key) => {
  const params = { headers: { authorization: `Bearer ${key}` } }
  return api.service('players')
    .patch(player._id, props, params)
    .then(res => createPlayer(res))
}
