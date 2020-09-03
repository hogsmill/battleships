
var size = 10

function swap(element, highlight) {
  if (highlight) {
    element.classList.add('highlighted')
  } else {
    element.classList.remove('highlighted')
  }
}

function swapHighlight(r, c, boat, orientation) {
  var i, id, element, cells = document.getElementsByClassName('board-cell')
  for (i = 0; i < cells.length; i++) {
    swap(cells[i], false)
  }
  if (orientation == 'horizontal') {
    c = placeN(c, boat)
    for (i = c; i < c + boat.size; i++) {
      id = 'c' + r + '-' + i
      element = document.getElementById(id)
      if (element) {
        swap(element, true)
      }
    }
  }
  if (orientation == 'vertical') {
    r = placeN(r, boat)
    for (i = r; i < r + boat.size; i++) {
      id = 'c' + i + '-' + c
      element = document.getElementById(id)
      if (element) {
        swap(element, true)
      }
    }
  }
}

function placeN(n, boat) {
  if (n + boat.size > size) {
    n = size - boat.size
  }
  return n
}

function notClashing(boat, r, c, orientation, board) {
  console.log('clashing', boat, r, c, orientation, board)
  return true
}

var Board = {

  highlight: function(r, c, boat, orientation) {
    swapHighlight(r, c, boat, orientation, true)
  },

  unhighlight: function(r, c, boat, orientation) {
    swapHighlight(r, c, boat, orientation, false)
  },

  select: function() {
    var i, ids = [], highlightedCells = document.getElementsByClassName('highlighted')
    for (i = 0; i < highlightedCells.length; i++) {
      ids.push(  highlightedCells[i].id)
    }
    for (i = 0; i < ids.length; i++) {
      document.getElementById(ids[i]).classList.add('selected')
      document.getElementById(ids[i]).classList.remove('highlighted')
    }
  },

  canPlaceBoat: function(boat, r, c, orientation, board) {
    var ok = false
    // physical placement
    if (orientation == 'vertical' && r + boat.size <= size && r + boat.size < 10) {
      ok = true
    }
    if (orientation == 'horizontal' && c + boat.size <= size && c + boat.size < 10) {
      ok = true
    }
    ok = notClashing(boat, r, c, orientation, board)
    return ok
  },

  placeN: function(n, boat) {
    return placeN(n, boat)
  },

  cellValue: function(r, c, board) {
    var cellVal = false
    for (var i = 0; i < board.length; i++) {
      var boat = board[i].boat
      if (board[i].orientation == 'horizontal' && r == board[i].row && c >= board[i].column && c < board[i].column + boat.size) {
        cellVal = boat.name
      } else if (board[i].orientation == 'vertical' && c == board[i].column && r >= board[i].row && r < board[i].row + boat.size) {
        cellVal = boat.name
      }
    }
    return cellVal
  },

  hitOrMiss: function(r, c, moves, agile, result) {
    var val = ''
    if (moves) {
      for (var i = 0; i < moves.length; i++) {
        if (r == moves[i].row && c == moves[i].column) {
          if (moves[i].hit) {
            val = {class: 'hit', boat: moves[i].hit.boat.name.split('')[0]}
          } else {
            val = {class: 'miss', boat: ''}
          }
          if (agile == 'no' && !result.win) {
            val = {class: 'played', boat: ''}
          }
        }
      }
    }
    return val
  }
}

export default Board
