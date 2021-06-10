<template>
  <div class="header-string">
    <h3>
      <span v-if="myName">I am <b>{{ myName.name }}</b></span>
      <span v-if="theirName">, I am playing <b>{{ theirName.name }}</b></span>
      <span v-if="iAmAgile()"> and I am <b>Agile</b> <i class="far fa-smile-beam" /></span>
      <span v-if="iAmNotAgile()"> and I am <b>not Agile</b> <i class="far fa-sad-tear" /></span>
    </h3>
  </div>
</template>

<script>
import bus from '../socket.js'

import game from '../lib/gameState.js'

export default {
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    gameStarted() {
      return this.$store.getters.getGameStarted
    },
    myName() {
      return this.$store.getters.getMyName
    },
    theirName() {
      return this.$store.getters.getTheirName
    }
  },
  methods: {
    iAmAgile() {
      return game.myBoard(this.gameState, this.myName).agile == 'yes'
    },
    iAmNotAgile() {
      return game.myBoard(this.gameState, this.myName).agile == 'no'
    }
  }
}
</script>

<style lang="scss">
  .header-string {

    .fa-smile-beam {
      color: palegreen;
    }

    .fa-sad-tear {
      color: firebrick;
    }
  }
</style>
