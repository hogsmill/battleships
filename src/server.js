const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')
const prod = os.hostname() == 'agilesimulations' ? true : false

const port = prod ? process.env.VUE_APP_PORT : 3008
const logFile = prod ? process.argv[4] : 'server.log'
const gameCollection =  prod ? process.env.VUE_APP_COLLECTION : 'battleships'

ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  Error: ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'
const maxIdleTime = 7200000

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

MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, function (err, client) {
  if (err) throw err
  const db = client.db('db')

  db.createCollection(gameCollection, function(error, collection) {})

  db.gameCollection = db.collection(gameCollection)

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

    socket.on('sendLoadResults', (data) => { dbStore.loadResults(db, io, data, debugOn) })

    socket.on('sendLoadGame', (data) => { dbStore.loadGame(db, io, data, debugOn) })

    socket.on('sendDeleteGame', (data) => { dbStore.deleteGame(db, io, data, debugOn) })

    socket.on('sendRestartGame', (data) => { dbStore.restartGame(db, io, data, debugOn) })

    socket.on('sendChangeName', (data) => { dbStore.changeName(db, io, data, debugOn) })

    socket.on('sendAddPlayer', (data) => { dbStore.addPlayer(db, io, data, debugOn) })

    socket.on('sendRemovePlayer', (data) => { dbStore.removePlayer(db, io, data, debugOn) })

    socket.on('sendSetAgile', (data) => { dbStore.setAgile(db, io, data, debugOn) })

    socket.on('sendPlaceBoat', (data) => { dbStore.placeBoat(db, io, data, debugOn) })

    socket.on('sendMakeMove', (data) => { dbStore.makeMove(db, io, data, debugOn) })
  })
})

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
