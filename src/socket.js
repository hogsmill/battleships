import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3008'
} else {
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// Send

bus.$on('sendLoadResults', (data) => { socket.emit('sendLoadResults', data) })

bus.$on('sendLoadGame', (data) => { socket.emit('sendLoadGame', data) })

bus.$on('sendDeleteGame', (data) => { socket.emit('sendDeleteGame', data) })

bus.$on('sendRestartGame', (data) => { socket.emit('sendRestartGame', data) })

bus.$on('sendAddPlayer', (data) => { socket.emit('sendAddPlayer', data) })

bus.$on('sendRemovePlayer', (data) => { socket.emit('sendRemovePlayer', data) })

bus.$on('sendChangeName', (data) => { socket.emit('sendChangeName', data) })

bus.$on('sendSetAgile', (data) => { socket.emit('sendSetAgile', data) })

bus.$on('sendMakeMove', (data) => { socket.emit('sendMakeMove', data) })

bus.$on('sendPlaceBoat', (data) => { socket.emit('sendPlaceBoat', data) })

// Receive

socket.on('loadResults', (data) => { bus.$emit('loadResults', data) })

socket.on('loadGame', (data) => { bus.$emit('loadGame', data) })

socket.on('gameDeleted', (data) => { bus.$emit('gameDeleted', data)  })

socket.on('updateGameState', (data) => { bus.$emit('updateGameState', data) })

socket.on('removePlayer', (data) => { bus.$emit('removePlayer', data) })

socket.on('gameOver', (data) => { bus.$emit('gameOver', data) })

socket.on('updateConnections', (data) => { bus.$emit('updateConnections', data) })

export default bus
