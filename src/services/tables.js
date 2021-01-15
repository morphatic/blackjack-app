import { api } from './api'
import { createTable } from '../models/Table'


/**
 * Finds a table by owner.
 *
 * @param   {string} owner _id of the player to be retrieved
 * @param   {string} key   The DID string that authenticates the request
 * @returns {object}       An object representing the player requested
 */
export const findTableByOwner = (owner, key) => {
  const params = { query: { owner }, headers: { authorization: `Bearer ${key}` } }
  return api.service('tables')
    .find(params)
    .then(res => createTable({ headers: { authorization: `Bearer ${key}` } })(res.data[0]))
}

export const updateTable = (table, props, params) =>  api.service('tables')
    .patch(table._id, props, params)
    .then(t => api.service('tables').get(t._id, { ...params, query: { $populate: 'games' } }))
    .then(t => createTable(params)(t))
    // .then(t => { console.log(t); return t })
