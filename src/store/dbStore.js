
function createNewGame(data) {

  const game = data
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
  game.lastaccess = new Date().toISOString()

  let total = 0
  for (let i = 0; i < game.boats.length; i++) {
    total = total + game.boats[i].size
  }
  game.totalScore = total

  return game
}

function hitOrMissBoat(r, c, boat) {
  let hit = false
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
  const board = i == 0 ? gameState[1].board : gameState[0].board
  let hit = false
  for (let j = 0; j < board.length; j++) {
    hit = hit || hitOrMissBoat(data.row, data.column, board[j])
  }
  return hit
}

function gameOver(game) {
  let over = {win: false}
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

function _loadGame(db, io, data, debugOn) {

  if (debugOn) { console.log('loadGame', data) }

  db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      db.gameCollection.updateOne({'_id': res._id}, {$set: {lastaccess: new Date().toISOString()} }, function(err) {
        if (err) throw err
      })
      if (debugOn) { console.log('Loading game \'' + data.gameName + '\'') }
      io.emit('loadGame', res)
    } else {
      const game = createNewGame(data)
      if (debugOn) { console.log('Creating game \'' + data.gameName + '\'') }
      db.gameCollection.insertOne(game, function(err, rec) {
        if (err) throw err
        io.emit('loadGame', game)
      })
    }
  })
}

module.exports = {

  loadGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    _loadGame(db, io, data, debugOn)
  },

  restartGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    db.gameCollection.deleteMany({gameName: data.gameName}, function(err, res) {
      _loadGame(db, io, data, debugOn)
    })
  },

  clearDetails: function(db, io, data, debugOn) {

    if (debugOn) { console.log('clearDetails', data) }

    db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const gameState = []
        for (let i = 0; i < gameState.length; i++) {
          const player = gameState[i]
          if (player.id != data.myName.id) {
            gameState.push(player)
          }
        }
        data.gameState = gameState
        io.emit('updateGameState', data)
        db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err
        })
      }
    })
  },

  addPlayer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addPlayer', data) }

    db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const gameState = res.gameState
        const existing = res.gameState.find((p) => {
          return p.id == data.player.id
        })
        if (!existing) {
          if (res.gameState.length >= 2) {
            io.emit('tooManyPlayers', data)
          } else {
            data.player.board = []
            data.player.moves = []
            data.player.score = 0
            data.player.nextGo = false
            gameState.push(data.player)
          }
        }
        if (gameState.length == 2 && !gameState[0].nextGo && !gameState[1].nextGo) {
          gameState[0].nextGo = true
        }
        data.gameState = gameState
        io.emit('updateGameState', data)
        db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err
        })
      }
    })
  },

  removePlayer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('removePlayer', data) }

    db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const gameState = []
        for (let i = 0; i < res.gameState.length; i++) {
          if (res.gameState[i].id != data.player.id) {
            gameState.push(res.gameState[i])
          }
        }
        data.gameState = gameState
        io.emit('updateGameState', data)
        io.emit('removePlayer', data)
        db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err
        })
      }
    })
  },

  setAgile: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setAgile', data) }

    db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const gameState = res.gameState
        const index = Math.round(Math.random(2)) == 0
        if (index == 0) {
          gameState[0].agile = 'yes'
          gameState[1].agile = 'no'
        } else {
          gameState[0].agile = 'no'
          gameState[1].agile = 'yes'
        }
        data.gameState = gameState
        io.emit('updateGameState', data)
        db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err
        })
      }
    })
  },

  changeName: function(db, io, data, debugOn) {

    if (debugOn) { console.log('changeName', data) }

    db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        let player
        const gameState = []
        for (let i = 0; i < res.gameState.length; i++) {
          player = res.gameState[i]
          if (player.id == data.name.id) {
            player.name = data.newName
          }
          gameState.push(player)
        }
        data.gameState = gameState
        io.emit('updateGameState', data)
        db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err
        })
      }
    })
  },

  placeBoat: function(db, io, data, debugOn) {

    if (debugOn) { console.log('placeBoat', data) }

    db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        let player
        const gameState = []
        for (let i = 0; i < res.gameState.length; i++) {
          player = res.gameState[i]
          const board = []
          if (player.id == data.name.id) {
            for (let j = 0; j < player.board.length; j++) {
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

        io.emit('updateGameState', data)
        db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: data.gameState}}, function(err, rec) {
          if (err) throw err
        })
      }
    })
  },

  makeMove: function(db, io, data, debugOn) {

    if (debugOn) { console.log('makeMove', data) }

    db.gameCollection.findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        let player
        const gameState = []
        for (let i = 0; i < res.gameState.length; i++) {
          player = res.gameState[i]
          if (player.id == data.name.id) {
            const hit = hitOrMiss(data, i, res.gameState)
            if (hit) {
              player.score = player.score + 1
            }
            player.moves.push({row: data.row, column: data.column, hit: hit})
          }
          gameState.push(player)
        }
        data.result = gameOver(res)
        if (data.result.win) {
          io.emit('gameOver', data)
        }
        data.gameState = gameState
        if (data.gameState[0].nextGo) {
          data.gameState[0].nextGo = false
          data.gameState[1].nextGo = true
        } else {
          data.gameState[1].nextGo = false
          data.gameState[0].nextGo = true
        }
        io.emit('updateGameState', data)
        db.gameCollection.updateOne({'_id': res._id}, {$set: {gameState: data.gameState, nextPlayer: data.nextPlayer}}, function(err, rec) {
          if (err) throw err
        })
      }
    })
  }

}
