
module.exports = {

  myBoard: function(gameState, name) {
    return gameState[0].id == name.id ? gameState[0].board : gameState[1].board
  },

  myMove: function(gameState, name) {
    return gameState[0].id == name.id ? gameState[0].move : gameState[1].move
  }
}
