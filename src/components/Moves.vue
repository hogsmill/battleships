<template>
  <div class="moves" v-if="gameSet">
    <div v-if="movesDone() == 0" class="no-moves">
      No. of Moves...
    </div>
    <div v-if="movesDone() > 0" class="moves-done" :style="{'width': getMoves()}">
      {{ movesDone() }}
    </div>
  </div>
</template>

<script>
import game from '../lib/gameState.js'

export default {
  computed: {
    myName() {
      return this.$store.getters.getMyName
    },
    maxMoves() {
      return this.$store.getters.getMaxMoves
    },
    gameSet() {
      return this.$store.getters.gameSet
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  methods: {
    getMoves() {
      return this.movesDone() / 40 * 100 + '%'
    },
    movesDone() {
      let moves = 0
      if (this.gameSet) {
        moves = game.myMoves(this.gameState, this.myName).length
      }
      return moves
    }
  }
}
</script>

<style lang="scss">

  .no-moves {
    color: #888;
    text-align: left;
    padding-left: 6px;
    font-style: italic;
  }

  .moves {
    width: 100%;
    text-align: center;
    border: 1px solid #ccc;
    height: 24px;
    background-color: #ddd;
    border-radius: 12px;

    .moves-done {
      border-radius: 12px;
      background-color: cadetblue;
      height: 24px;
      color: #fff;
      text-align: right;
      padding-right: 8px;
      position: relative;
      top: -1px;
      left: -1px;
    }
  }
</style>
