import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
// import socketio from '@feathersjs/socketio-client'
// import io from 'socket.io-client'
import axios from 'axios'

// instantiate a feathers client
const api = feathers()

// configure REST transport
const rc = rest(process.env.REACT_APP_API_URL)
api.configure(rc.axios(axios))

// configure socket.io client
// const sock = io(process.env.REACT_APP_API_URL)
// api.configure(socketio(sock))

export {
  api,
}
