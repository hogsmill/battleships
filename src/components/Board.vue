<template>

  <table>
    <tr>
      <td>
        <table class="board">
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
        <div v-for="(boat, b) in boats" :key="b" class="place">
          <button class="btn btn-sm btn-secondary smaller-font horizontal" @click="place(boat, 'horizontal')">&#x2192;</button>
          <button class="btn btn-sm btn-secondary smaller-font vertical" @click="place(boat, 'vertical')">&#x2193;</button>
          <div class="boat" :class="boat"></div>
        </div>
      </td>
    </tr>
  </table>

</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      boats: [
        'carrier',
        'battleship',
        'destroyer',
        'submarine',
        'patrol-boat'
      ]
    }
  },
  methods: {
    place(boat, orientation) {
      alert('Place ' + boat + ' ' + orientation + 'ly')
    }
  },
  computed: {
    myName() {
      return this.$store.getters.getMyName;
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

  table.board {
    margin: 0 auto;

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
    }
  }

</style>
