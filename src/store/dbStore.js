
function createNewGame(data) {

  var game = data
  game.gameName = data.gameName
  game.players = []
  game.created = new Date().toISOString()

  return game
}

module.exports = {

  loadGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        if (debugOn) { console.log("Loading game '" + data.gameName + "'") }
        io.emit("loadGame", res)
        client.close();
      } else {
        var game = createNewGame(data)
        if (debugOn) { console.log("Creating game '" + data.gameName + "'") }
        db.collection('battleships').insertOne(game, function(err, rec) {
          if (err) throw err;
          io.emit("loadGame", game)
          client.close()
        })
      }
    })
  },

  addPlayer: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addPlayer', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var players = res.players
        if (!res.players.find(function(p) { return p.id == data.player.id })) {
          data.player.board = []
          players.push(data.player)
        }
        data.players = players
        io.emit("updatePlayers", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {players: data.players}}, function(err, rec) {
          if (err) throw err;
          client.close()
        })
      }
    })
  },

  removePlayer: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('removePlayer', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        console.log(res, data)
        var players = []
        for (var i = 0; i < res.players.length; i++) {
          if (res.players[i].id != data.player.id) {
            players.push(res.players[i])
          }
        }
        data.players = players
        io.emit("updatePlayers", data)
        io.emit("removePlayer", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {players: data.players}}, function(err, rec) {
          if (err) throw err;
          client.close()
        })
      }
    })
  },

  changeName: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('changeName', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var player, players = []
        for (var i = 0; i < res.players.length; i++) {
          player = res.players[i]
          if (player.id == data.name.id) {
            player.name = data.newName
          }
          players.push(player)
        }
        data.players = players
        io.emit("updatePlayers", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {players: data.players}}, function(err, rec) {
          if (err) throw err;
          client.close()
        })
      }
    })
  },

  placeBoat: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('placeBoat', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var player, players = []
        for (var i = 0; i < res.players.length; i++) {
          player = res.players[i]
          var board = []
          if (player.id == data.name.id) {
            for (var j = 0; j < player.board.length; j++) {
              if (player.board[i].boat.name != data.boat.name) {
                board.push(player.board[i])
              }
            }
            board.push({boat: data.boat, name: data.name, orientation: data.orientation, row: data.row, column: data.column})
            player.board = board
          }
          players.push(player)
        }
        data.players = players
        io.emit("updatePlayers", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {players: data.players}}, function(err, rec) {
          if (err) throw err;
          client.close()
        })
      }
    })
  }

}
