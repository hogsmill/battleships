
var size = 10

var Board = {

  highlight: function(r, c, boat, orientation) {
    var i, id, element, cells = document.getElementsByClassName('board-cell')
    for (i = 0; i < cells.length; i++) {
      cells[i].classList.remove('highlighted')
    }
    if (orientation == 'horizontal') {
      for (i = c; i < c + boat.size; i++) {
        id = 'c' + r + '-' + i
        element = document.getElementById(id)
        if (element) {
          element.classList.add('highlighted')
        }
      }
    }
    if (orientation == 'vertical') {
      for (i = r; i < r + boat.size; i++) {
        id = 'c' + i + '-' + c
        element = document.getElementById(id)
        if (element) {
          element.classList.add('highlighted')
        }
      }
    }
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
    if (orientation == 'vertical' && r + boat.size <= size) {
      ok = true
    }
    if (orientation == 'horizontal' && c + boat.size <= size) {
      ok = true
    }
    console.log('canPlaceBoat', ok, board)
    return ok
  }
}

export default Board
