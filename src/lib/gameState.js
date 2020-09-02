
module.exports = {

  myBoard: function(gameState, name) {
    return gameState[0].id == name.id ? gameState[0] : gameState[1]
  },

  theirBoard: function(gameState, name) {
    return gameState[0].id != name.id ? gameState[0] : gameState[1]
  },

  myMoves: function(gameState, name) {
    return gameState[0].id == name.id ? gameState[0].moves : gameState[1].moves
  }
}
