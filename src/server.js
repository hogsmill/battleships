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
var maxConnections = 10

function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

function loadGame(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.loadGame(err, client, db, io, data, debugOn)
  })
}

function addPlayer(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.addPlayer(err, client, db, io, data, debugOn)
  })
}

function changeName(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.changeName(err, client, db, io, data, debugOn)
  })
}

io.on("connection", (socket) => {
  connections = connections + 1
  if (connections > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id}. (${connections} connections)`)
  }

  socket.on("disconnect", () => {
    connections = connections - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected. (${connections} connections)`)
  })

  socket.on("loadGame", (data) => { loadGame(data) });

  socket.on("changeName", (data) => { changeName(data) })

  socket.on("addPlayer", (data) => { addPlayer(data) });

});

var port = process.argv[2] || 3008

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
