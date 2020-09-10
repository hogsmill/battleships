const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require('os')

var dbStore = require('./store/dbStore.js')

var MongoClient = require('mongodb').MongoClient;

var prod = os.hostname() == "agilesimulations" ? true : false
var url = prod ?  "mongodb://127.0.0.1:27017/" : "mongodb://localhost:27017/"

var connectDebugOff = prod
var debugOn = !prod

var connections = 0
var maxConnections = 2500

function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

function doDb(fun, data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');

    switch(fun) {
      case 'loadGame':
        dbStore.loadGame(err, client, db, io, data, debugOn)
        break;
      case 'restartGame':
        dbStore.restartGame(err, client, db, io, data, debugOn)
        break;
      case 'addPlayer':
        dbStore.addPlayer(err, client, db, io, data, debugOn)
        break;
      case 'removePlayer':
        dbStore.removePlayer(err, client, db, io, data, debugOn)
        break;
      case 'setAgile':
        dbStore.setAgile(err, client, db, io, data, debugOn)
        break;
      case 'changeName':
        dbStore.changeName(err, client, db, io, data, debugOn)
        break;
      case 'placeBoat':
        dbStore.placeBoat(err, client, db, io, data, debugOn)
        break;
      case 'makeMove':
        dbStore.makeMove(err, client, db, io, data, debugOn)
        break;
    }
  })
}
io.on("connection", (socket) => {
  connections = connections + 1
  if (connections > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id}. (${connections} connections)`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  }

  socket.on("disconnect", () => {
    connections = connections - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected. (${connections} connections)`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  })

  socket.on("loadGame", (data) => { doDb('loadGame', data) })

  socket.on("restartGame", (data) => { doDb('restartGame', data) })

  socket.on("changeName", (data) => { doDb('changeName', data) })

  socket.on("addPlayer", (data) => { doDb('addPlayer', data) })

  socket.on("removePlayer", (data) => { doDb('removePlayer', data) })

  socket.on("setAgile", (data) => { doDb('setAgile', data) })

  socket.on("placeBoat", (data) => { doDb('placeBoat', data) })

  socket.on("makeMove", (data) => { doDb('makeMove', data) })

});

var port = process.argv[2] || 3008

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
