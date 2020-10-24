const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const logFile = process.argv[4]

ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (currentAction) {
    logStr = logStr + '  Action: ' + currentAction + '\n'
  }
  if (currentData) {
    logStr = logStr + '  Data: ' + currentData + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  Error: ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const os = require('os')

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const prod = os.hostname() == 'agilesimulations' ? true : false
const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'

const connectDebugOff = prod
const debugOn = !prod

let connections = 0
const maxConnections = 2500

function emit(event, data) {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

let currentAction = ''
let currentData = ''
function doDb(fun, data) {
  currentAction = fun
  currentData = data
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err
    const db = client.db('db')

    switch(fun) {
      case 'loadGame':
        dbStore.loadGame(err, client, db, io, data, debugOn)
        break
      case 'restartGame':
        dbStore.restartGame(err, client, db, io, data, debugOn)
        break
      case 'addPlayer':
        dbStore.addPlayer(err, client, db, io, data, debugOn)
        break
      case 'removePlayer':
        dbStore.removePlayer(err, client, db, io, data, debugOn)
        break
      case 'setAgile':
        dbStore.setAgile(err, client, db, io, data, debugOn)
        break
      case 'changeName':
        dbStore.changeName(err, client, db, io, data, debugOn)
        break
      case 'placeBoat':
        dbStore.placeBoat(err, client, db, io, data, debugOn)
        break
      case 'makeMove':
        dbStore.makeMove(err, client, db, io, data, debugOn)
        break
    }
  })
}
io.on('connection', (socket) => {
  connections = connections + 1
  if (connections > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id}. (${connections} connections)`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  }

  socket.on('disconnect', () => {
    connections = connections - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected. (${connections} connections)`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  })

  socket.on('loadGame', (data) => { doDb('loadGame', data) })

  socket.on('restartGame', (data) => { doDb('restartGame', data) })

  socket.on('changeName', (data) => { doDb('changeName', data) })

  socket.on('addPlayer', (data) => { doDb('addPlayer', data) })

  socket.on('removePlayer', (data) => { doDb('removePlayer', data) })

  socket.on('setAgile', (data) => { doDb('setAgile', data) })

  socket.on('placeBoat', (data) => { doDb('placeBoat', data) })

  socket.on('makeMove', (data) => { doDb('makeMove', data) })

})

const port = process.argv[2] || 3008

http.listen(port, () => {
  console.log('Listening on *:' + port)
})
