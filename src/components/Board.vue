<template>

  <table>
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
            <td v-for="(col, c) in columns" :key="c" :id="rows[r] + columns[c]"></td>
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
            <td class="board-cell" v-for="(col, c) in columns" :key="c" :id="'c' + r + '-' + c" @click="place(r, c)" @mouseover="highlight(r, c)"></td>
          </tr>
        </table>
      </td>
      <td>
        <div v-for="(boat, b) in boats" :key="b" class="place" :class="{selected: selectedBoat.name == boat.name}">
          <button class="btn btn-sm btn-secondary smaller-font horizontal" @click="selectBoat(boat, 'horizontal')" :title="'Place ' + boat.name + ' horizontally'">&#x2192;</button>
          <button class="btn btn-sm btn-secondary smaller-font vertical" @click="selectBoat(boat, 'vertical')" :title="'Place ' + boat.name + ' vertically'">&#x2193;</button>
          <div class="boat" :class="boat.name"></div>
        </div>
      </td>
    </tr>
  </table>

</template>

<script>
import board from '../lib/board.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      boats: [
        {name: 'carrier', placed: false, size: 5},
        {name: 'battleship', placed: false, size: 4},
        {name: 'submarine', placed: false, size: 3},
        {name: 'destroyer', placed: false, size: 3},
        {name: 'patrol-boat', placed: false, size: 2}
      ],
      selectedOrientation: '',
      selectedBoat: ''
    }
  },
  methods: {
    selectBoat(boat, orientation) {
      this.selectedBoat = boat
      this.selectedOrientation = orientation
    },
    highlight(r, c) {
      if (this.selectedBoat && this.selectedOrientation) {
        board.highlight(r, c, this.selectedBoat, this.selectedOrientation)
      }
    },
    place(r, c) {
      if (this.selectedBoat && this.selectedOrientation && board.canPlaceBoat(this.selectedBoat, r, c, this.selectedOrientation, this.myBoard)) {
        console.log('Placing ' + this.selectedBoat.name + ' ' + this.selectedOrientation + 'ly at (' + this.rows[r] + ', ' + this.columns[c] + ')')
        this.socket.emit("placeBoat", {gameName: this.gameName, name: this.myName, boat: this.selectedBoat, orientation: this.selectedOrientation, row: r, column: c})
        this.selectedBoat = ''
        this.selectedOrientation = ''
        board.select()
      }
    }
  },
  computed: {
    myName() {
      return this.$store.getters.getMyName;
    },
    myBoard() {
      return this.$store.getters.getMyBoard;
    },
    theirName() {
      return this.$store.getters.getTheirName;
    },
    gameName() {
      return this.$store.getters.getGameName;
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
