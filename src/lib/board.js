
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

function nBetween(n, _start, _end) {
  return n >= _start && n <= _end
}

function clash(r1, c1, orientation1, size1, r2, c2, orientation2, size2) {
  var clashing = false
  var c1end = parseInt(c1 + size1)
  var c2end = parseInt(c2 + size2)
  var r1end = parseInt(r1 + size1)
  var r2end = parseInt(r2 + size2)
  console.log(orientation1, orientation2)
  if (orientation1 == 'horizontal' && orientation2 == 'horizontal') {
    clashing = r1 == r2 && (nBetween(c2, c1, c1end) || nBetween(c2end, c1, c1end))
  } else if (orientation1 == 'horizontal' && orientation2 == 'vertical') {
    clashing = nBetween(r1, r2, r2end - 1) && nBetween(c2, c1, c1end)
  } else if (orientation1 == 'vertical' && orientation2 == 'horizontal') {
    clashing = nBetween(r2, r1, r1end) && nBetween(c1, c2, c2end - 1)
  } else if (orientation1 == 'vertical' && orientation2 == 'vertical') {
    clashing = c1 == c2 && (nBetween(r2, r1, r1end) || nBetween(r2end, r1, r1end))
  }
  return clashing
}

function notClashing(boat, r, c, orientation, board) {
  var clashing = false
  for (var i = 0; i < board.length; i++) {
    if (clash(r, c, orientation, boat.size, board[i].row, board[i].column, board[i].orientation, board[i].boat.size)) {
      clashing = true
    }
  }
  return !clashing
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
