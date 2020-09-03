
function createNewGame(data) {

  var game = data
  game.gameName = data.gameName
  game.gameState = [],
  game.result = {},
  game.maxMoves = 40,
  game.boats = [
    {name: 'carrier', size: 5},
    {name: 'battleship', size: 4},
    {name: 'submarine', size: 3},
    {name: 'destroyer', size: 3},
    {name: 'patrol-boat', size: 2}
  ]
  game.created = new Date().toISOString()

  var total = 0
  for (var i = 0; i < game.boats.length; i++) {
    total = total + game.boats[i].size
  }
  game.totalScore = total

  return game
}

function hitOrMissBoat(r, c, boat) {
  var hit = false
  if (boat.orientation == 'horizontal') {
    if (r == boat.row && c >= boat.column && c < parseInt(boat.column + boat.boat.size)) {
      hit = boat
    }
  } else {
    if (c == boat.column && r >= boat.row && r < boat.row + boat.boat.size) {
      hit = boat
    }
  }
  return hit
}

function hitOrMiss(data, i, gameState) {
  var board = i == 0 ? gameState[1].board : gameState[0].board
  var hit = false
  for (var j = 0; j < board.length; j++) {
    hit = hit || hitOrMissBoat(data.row, data.column, board[j])
  }
  return hit
}

function gameOver(game) {
  var over = {win: false}
  if (game.gameState[0].moves.length >= game.maxMoves && game.gameState[1].moves.length >= game.maxMoves) {
    over = {win: true, allMovesDone: true}
  }
  if (game.gameState[0].score == game.totalScore) {
    over = {win: true, player: 0}
  }
  if (game.gameState[1].score == game.totalScore) {
    over = {win: true, player: 1}
  }
  return over
}

function _loadGame(err, client, db, io, data, debugOn) {

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
}

module.exports = {

  loadGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    _loadGame(err, client, db, io, data, debugOn)
  },

  restartGame: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    db.collection('battleships').deleteMany({gameName: data.gameName}, function(err, res) {
      _loadGame(err, client, db, io, data, debugOn)
    })
  },

  addPlayer: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addPlayer', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var gameState = res.gameState
        if (!res.gameState.find(function(p) { return p.id == data.player.id })) {
          data.player.board = []
          data.player.moves = []
          data.player.score = 0
          gameState.push(data.player)
        }
        data.gameState = gameState
        io.emit("updateGameState", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err;
        })
      }
    })
  },

  removePlayer: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('removePlayer', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var gameState = []
        for (var i = 0; i < res.gameState.length; i++) {
          if (res.gameState[i].id != data.player.id) {
            gameState.push(res.gameState[i])
          }
        }
        data.gameState = gameState
        io.emit("updateGameState", data)
        io.emit("removePlayer", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err;
        })
      }
    })
  },

  setAgile: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setAgile', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var gameState = res.gameState
        var index = Math.round(Math.random(2)) == 0
        if (index == 0) {
          gameState[0].agile = 'yes'
          gameState[1].agile = 'no'
        } else {
          gameState[0].agile = 'no'
          gameState[1].agile = 'yes'
        }
        data.gameState = gameState
        io.emit("updateGameState", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err;
        })
      }
    })
  },

  changeName: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('changeName', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var player, gameState = []
        for (var i = 0; i < res.gameState.length; i++) {
          player = res.gameState[i]
          if (player.id == data.name.id) {
            player.name = data.newName
          }
          gameState.push(player)
        }
        data.gameState = gameState
        io.emit("updateGameState", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err;
        })
      }
    })
  },

  placeBoat: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('placeBoat', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var player, gameState = []
        for (var i = 0; i < res.gameState.length; i++) {
          player = res.gameState[i]
          var board = []
          if (player.id == data.name.id) {
            for (var j = 0; j < player.board.length; j++) {
              if (player.board[j].boat.name != data.boat.name) {
                board.push(player.board[j])
              }
            }
            board.push({boat: data.boat, orientation: data.orientation, row: data.row, column: data.column})
            player.board = board
          }
          gameState.push(player)
        }
        data.gameState = gameState
        io.emit("updateGameState", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err;
        })
      }
    })
  },

  makeMove: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('makeMove', data) }

    db.collection('battleships').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err;
      if (res) {
        var player, gameState = []
        for (var i = 0; i < res.gameState.length; i++) {
          player = res.gameState[i]
          if (player.id == data.name.id) {
            var hit = hitOrMiss(data, i, res.gameState)
            if (hit) {
              player.score = player.score + 1
            }
            player.moves.push({row: data.row, column: data.column, hit: hit})
          }
          gameState.push(player)
        }
        data.result = gameOver(res)
        if (data.result.win) {
          io.emit("gameOver", data)
        }
        data.gameState = gameState
        io.emit("updateGameState", data)
        db.collection('battleships').updateOne({"_id": res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err;
        })
      }
    })
  }

}
