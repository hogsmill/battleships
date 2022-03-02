<template>
  <table v-if="gameSet" class="game-table">
    <tr>
      <td>
        <h3 :class="{ 'no-header': !theirName, 'next-go': theirName.nextGo }">
          {{ theirName.name }}'s Board <i v-if="theirName.nextGo" :title="theirName.name + 's go next'" class="fas fa-check-circle" />
        </h3>
        <table class="board their-board">
          <tr>
            <td class="header" />
            <td class="header" v-for="(column, col) in columns" :key="col">
              {{ column }}
            </td>
          </tr>
          <tr v-for="(row, r) in rows" :key="r">
            <td class="header">
              {{ row }}
            </td>
            <td :class="hitOrMissThem(r, c).class" class="their-board-cell" v-for="(col, c) in columns" :key="c" :id="rows[r] + columns[c]" @click="makeMove(r, c)">
              {{ hitOrMissThem(r, c).boat }}
            </td>
          </tr>
        </table>
      </td>
      <td>
        <h3 :class="{ 'next-go': myPlayer.nextGo }">
          My Board <i v-if="myPlayer.nextGo" title="My go next" class="fas fa-check-circle" />
        </h3>
        <table class="board my-board">
          <tr>
            <td class="header" />
            <td class="header" v-for="(column, col) in columns" :key="col">
              {{ column }}
            </td>
          </tr>
          <tr v-for="(row, r) in rows" :key="r">
            <td class="header">
              {{ row }}
            </td>
            <td class="board-cell" :class="myCellClass(r, c)" v-for="(col, c) in columns" :key="c" :id="'c' + r + '-' + c" @click="place(r, c)" @mouseover="highlight(r, c)">
              {{ cellBoat(r, c) }}
            </td>
          </tr>
        </table>
      </td>
      <td>
        <h3>
          Score: {{ agile() || result.win ? score() : '?' }}/{{ totalScore }}
        </h3>
        <div v-for="(boat, b) in boats" :key="b" class="place" :class="{ 'placed': placed(boat), 'selected': selectedBoat.name == boat.name, 'rounded-top': b == 0, 'rounded-bottom': b == boats.length- 1}">
          <button class="btn btn-sm btn-secondary smaller-font horizontal" @click="selectBoat(boat, 'horizontal')" :disabled="gameStarted" :title="'Place ' + boat.name + ' horizontally'">
            &#x2192;
          </button>
          <button class="btn btn-sm btn-secondary smaller-font vertical" @click="selectBoat(boat, 'vertical')" :disabled="gameStarted" :title="'Place ' + boat.name + ' vertically'">
            &#x2193;
          </button>
          <div class="boat" :class="boat.name" />
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../socket.js'

import board from '../lib/board.js'
import game from '../lib/gameState.js'

export default {
  data() {
    return {
      columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      selectedOrientation: '',
      selectedBoat: ''
    }
  },
  computed: {
    myName() {
      return this.$store.getters.getMyName
    },
    myPlayer() {
      return this.$store.getters.getMyPlayer
    },
    theirName() {
      return this.$store.getters.getTheirName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    boats() {
      return this.$store.getters.getBoats
    },
    totalScore() {
      return this.$store.getters.getTotalScore
    },
    maxMoves() {
      return this.$store.getters.getMaxMoves
    },
    result() {
      return this.$store.getters.getResult
    },
    gameSet() {
      return this.$store.getters.getGameSet
    },
    gameReady() {
      return this.$store.getters.getGameReady
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    gameStarted() {
      return this.$store.getters.getGameStarted
    }
  },
  methods: {
    placed(boat) {
      return game.myBoard(this.gameState, this.myName).board.find((b) => {
        return b.boat.name == boat.name
      })
    },
    score() {
      return game.myBoard(this.gameState, this.myName).score
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
      if (!this.gameReady) {
        alert('Game not ready to start - someone hasn\'t placed all their boats')
      } else if (!this.myPlayer.nextGo){
        alert('It\'s is not your go...')
      } else {
        const moves = game.myBoard(this.gameState, this.myName).moves.length
        if (moves >= this.maxMoves) {
          alert('You have no more moves')
        } else {
          bus.emit('sendMakeMove', {gameName: this.gameName, name: this.myName, row: r, column: c})
        }
      }
    },
    myCellClass(r, c) {
      const hit = this.hitOrMissMe(r, c)
      if (hit && hit.class == 'hit') {
        return 'hit'
      } else if (this.cellBoat(r, c) != '') {
        return 'selected'
      } else {
        return ''
      }
    },
    agile() {
      return game.myBoard(this.gameState, this.myName).agile == 'yes'
    },
    hitOrMissThem(r, c) {
      if (this.gameSet) {
        const agile = game.myBoard(this.gameState, this.myName).agile
        const moves = game.myMoves(this.gameState, this.myName)
        return board.hitOrMiss(r, c, moves, agile, this.result)
      }
    },
    hitOrMissMe(r, c) {
      if (this.gameSet) {
        const moves = game.theirMoves(this.gameState, this.myName)
        return board.hitOrMiss(r, c, moves, false, this.result)
      }
    },
    place(r, c) {
      const myBoard = game.myBoard(this.gameState, this.myName).board
      if (this.selectedBoat && this.selectedOrientation && board.canPlaceBoat(this.selectedBoat, r, c, this.selectedOrientation, myBoard)) {
        if (this.selectedOrientation == 'vertical') {
          r = board.placeN(r, this.selectedBoat)
        }
        if (this.selectedOrientation == 'horizontal') {
          c = board.placeN(c, this.selectedBoat)
        }
        console.log('Placing ' + this.selectedBoat.name + ' ' + this.selectedOrientation + 'ly at (' + this.rows[r] + ', ' + this.columns[c] + ')')
        bus.emit('sendPlaceBoat', {gameName: this.gameName, name: this.myName, boat: this.selectedBoat, orientation: this.selectedOrientation, row: r, column: c})
        this.selectedBoat = ''
        this.selectedOrientation = ''
      }
    },
    cellBoat(r, c) {
      if (this.gameSet) {
        const myBoard = game.myBoard(this.gameState, this.myName).board
        const val = board.cellValue(r, c, myBoard)
        if (val) {
           return val.split('')[0].toUpperCase()
        } else {
          return ''
        }
      }
    }
  }
}
</script>

<style lang="scss">

  $cell-width: 50px;
  $cell-height: 40px;
  $header-color: cadetblue;

  .no-header {
    color: #fff;
  }

  .game-table {
    background: none;

    td {
      border: none;
    }
  }

  h3 {
    border-radius: 6px;
    color: #fff;

    &.next-go {
      color: #fff;
      background-color: darkgreen;
      margin-right: 12px;
    }
  }

  table.board {
    margin-right: 12px;

    .board-cell, .their-board-cell {
      background-color: #fff;
    }

    .their-board-cell {

      &:hover {
        background-color: #eee;
      }
    }
    .highlighted {
      background-color: red;
    }

    .selected {
      background-color: green;
      font-weight: bold;
      color: #fff;
      border: none;
    }

    td {
      border: 1px solid #eee;
      width: $cell-width;
      height: $cell-height;

      &.header {
        background-color: $header-color;
        border: none;
        color: #fff;
        font-weight: bold;
      }

      &.hit {
        background-color: red;
        border: none;
      }

      &.miss {
        background-color: #ccc;
        border: none;
      }

      &.played {
        background-color: #ccc;
        border: none;
      }
    }
  }

  .place {
    position: relative;
    border: 2px solid #fff;
    background-color: #fff;

    &.placed {
      opacity: 0.4;
    }

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
      height: 90px;
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
