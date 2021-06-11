<template>
  <div class="who-is-agile">
    <button v-if="gameState.length >= 2 && !agileSet" class="name btn btn-primary" @click="setAgile()">
      Who is Agile?
    </button>
  </div>
</template>

<script>
import bus from '../socket.js'

import game from '../lib/gameState.js'

export default {
  computed: {
    myName() {
      return this.$store.getters.getMyName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    agileSet() {
      return this.$store.getters.getAgileSet
    }
  },
  methods: {
    iAmAgile() {
      return game.myBoard(this.gameState, this.myName).agile == 'yes'
    },
    iAmNotAgile() {
      return game.myBoard(this.gameState, this.myName).agile == 'no'
    },
    setAgile() {
      bus.$emit('sendSetAgile', {gameName: this.gameName})
    }
  }
}
</script>

<style lang="scss">

  .who-is-agile {
    width: 140px;
    display: inline-block;
  }

</style>
