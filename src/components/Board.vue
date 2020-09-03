<template>

  <table v-if="gameSet">
    <tr>
      <td>
        <h3 :class="{'no-header': !theirName}">{{theirName.name}}'s Board</h3>
        <table class="board their-board">
          <tr>
           <td class="header"></td>
           <td class="header" v-for="(column, col) in columns" :key="col">{{column}}</td>
          </tr>
          <tr v-for="(row, r) in rows" :key="r">
            <td class="header">{{row}}</td>
            <td :class="hitOrMiss(r, c).class" v-for="(col, c) in columns" :key="c" :id="rows[r] + columns[c]" @click="makeMove(r, c)">{{hitOrMiss(r, c).boat}}</td>
          </tr>
        </table>
      </td>
      <td>
        <h3>My Board</h3>
        <table class="board my-board">
          <tr>
           <td class="header"></td>
           <td class="header" v-for="(column, col) in columns" :key="col">{{column}}</td>
          </tr>
          <tr v-for="(row, r) in rows" :key="r">
            <td class="header">{{row}}</td>
            <td class="board-cell" :class="{'selected': cellBoat(r, c) != ''}" v-for="(col, c) in columns" :key="c" :id="'c' + r + '-' + c" @click="place(r, c)" @mouseover="highlight(r, c)">
              {{cellBoat(r, c)}}
            </td>
          </tr>
        </table>
      </td>
      <td>
        <h3>Score: {{score()}}/{{totalScore}}</h3>
        <div v-for="(boat, b) in boats" :key="b" class="place" :class="{selected: selectedBoat.name == boat.name}">
          <button class="btn btn-sm btn-secondary smaller-font horizontal" @click="selectBoat(boat, 'horizontal')" :disabled="gameStarted()" :title="'Place ' + boat.name + ' horizontally'">&#x2192;</button>
          <button class="btn btn-sm btn-secondary smaller-font vertical" @click="selectBoat(boat, 'vertical')" :disabled="gameStarted()" :title="'Place ' + boat.name + ' vertically'">&#x2193;</button>
          <div class="boat" :class="boat.name"></div>
        </div>
      </td>
    </tr>
  </table>

</template>

<script>
import board from '../lib/board.js'
import game from '../lib/gameState.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      selectedOrientation: '',
      selectedBoat: ''
    }
  },
  methods: {
    score() {
      return document.getElementsByClassName('hit').length
    },
    selectBoat(boat, orientation) {
      this.selectedBoat = boat
      this.selectedOrientation = orientation
    },
    highlight(r, c) {
      if (this.selectedBoat && this.selectedOrientation) {
        board.highlight(r, c, this.selectedBoat, this.selectedOrientation)
      }
    },
    makeMove(r, c) {
      var moves = game.myBoard(this.gameState, this.myName).moves.length
      if (moves >= this.maxMoves) {
        alert('You have no more moves')
      } else {
        this.socket.emit("makeMove", {gameName: this.gameName, name: this.myName, row: r, column: c})
      }
    },
    hitOrMiss(r, c) {
      if (this.gameSet) {
        var agile = game.myBoard(this.gameState, this.myName).agile
        var moves = game.myMoves(this.gameState, this.myName)
        return board.hitOrMiss(r, c, moves, agile, this.result)
      }
    },
    gameStarted() {
      return this.gameState[0].moves.length > 0 || this.gameState[1].moves.length > 0
    },
    place(r, c) {
      var myBoard = game.myBoard(this.gameState, this.myName).board
      if (this.selectedBoat && this.selectedOrientation && board.canPlaceBoat(this.selectedBoat, r, c, this.selectedOrientation, myBoard)) {
        if (this.selectedOrientation == 'vertical') {
          r = board.placeN(r, this.selectedBoat)
        }
        if (this.selectedOrientation == 'horizontal') {
          c = board.placeN(c, this.selectedBoat)
        }
        console.log('Placing ' + this.selectedBoat.name + ' ' + this.selectedOrientation + 'ly at (' + this.rows[r] + ', ' + this.columns[c] + ')')
        this.socket.emit("placeBoat", {gameName: this.gameName, name: this.myName, boat: this.selectedBoat, orientation: this.selectedOrientation, row: r, column: c})
        this.selectedBoat = ''
        this.selectedOrientation = ''
      }
    },
    cellBoat(r, c) {
      if (this.gameSet) {
        var myBoard = game.myBoard(this.gameState, this.myName).board
        var val = board.cellValue(r, c, myBoard)
        if (val) {
           return val.split('')[0].toUpperCase()
        } else {
          return ''
        }
      }
    }
  },
  computed: {
    myName() {
      return this.$store.getters.getMyName;
    },
    theirName() {
      return this.$store.getters.getTheirName;
    },
    gameName() {
      return this.$store.getters.getGameName;
    },
    boats() {
      return this.$store.getters.getBoats;
    },
    totalScore() {
      return this.$store.getters.getTotalScore;
    },
    maxMoves() {
      return this.$store.getters.getMaxMoves;
    },
    result() {
      return this.$store.getters.getResult;
    },
    gameSet() {
      return this.$store.getters.gameSet;
    },
    gameState() {
      return this.$store.getters.getGameState;
    }
  }
}
</script>

<style lang="scss">

  $cell-size: 50px;
  $header-color: #86c6ea;

  .no-header {
    color: #fff;
  }

  table.board {
    margin: 0 auto;

    .highlighted {
      background-color: red;
    }

    .selected {
      background-color: green;
      font-weight: bold;
      color: #fff;
    }

    td {
      border: 1px solid #ccc;
      width: $cell-size;
      height: $cell-size;

      &.header {
        background-color: $header-color;
        color: #fff;
        font-weight: bold;
      }

      &.hit {
        background-color: green;
      }

      &.miss {
        background-color: red;
      }

      &.played {
        background-color: #ccc;
      }
    }
  }

  .place {
    position: relative;
    border: 2px solid #fff;

    &.selected {
      border-color: red;
    }
    button {
      display: inline-block;
      width: 36px;

      &.horizontal {
        position: absolute;
        left: 24px;
        top: 18px;
      }

      &.vertical {
        position: absolute;
        left: 65px;
        top: 18px;
      }
    }

    .boat {
      display: inline-block;
      margin-left: 110px;
      height: 100px;
      width: 250px;
      background-repeat: no-repeat;

      &.carrier { background-image: url("../assets/img/carrier.png"); }
      &.battleship { background-image: url("../assets/img/battleship.png"); }
      &.destroyer { background-image: url("../assets/img/destroyer.png"); }
      &.submarine { background-image: url("../assets/img/submarine.png"); }
      &.patrol-boat { background-image: url("../assets/img/patrol-boat.png"); }

      button {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

</style>
