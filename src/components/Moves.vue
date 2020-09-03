<template>

  <div class="moves">
    <div v-for="(move, d) in movesDone()" :key="'done-' + d" class="move done rounded-circle">{{move}}</div>
    <div v-for="(move, n) in movesNotDone()" :key="'not-done-' + n" class="move rounded-circle">{{move}}</div>
  </div>

</template>

<script>
import game from '../lib/gameState.js'

export default {
  methods: {
    movesDone() {
      var arr = [], myMove = 0
      if (this.gameSet) {
        myMove = game.myMoves(this.gameState, this.myName).length
      }
      for (var i = 1; i <= myMove; i++) {
        arr.push(i)
      }
      return arr
    },
    movesNotDone() {
      var arr = [], myMove = 0
      if (this.gameSet) {
        myMove = game.myMoves(this.gameState, this.myName).length
      }
      for (var i = myMove + 1; i <= 40; i++) {
        arr.push(i)
      }
      return arr
    }
  },
  computed: {
    myName() {
      return this.$store.getters.getMyName;
    },
    maxMoves() {
      return this.$store.getters.getMaxMoves;
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

  .moves {
    width: 100%;
    text-align: center;

    .move {
      height: 24px;
      width: 24px;
      border: 1px solid;
      margin: 1px;
      display: inline-block;

      &.done {
        background-color: green;
        border-color: green;
        color: #fff;
      }
    }
  }
</style>
