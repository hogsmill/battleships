<template>
  <div class="headerString">
    <div>
      <span v-if="myName">I am <b>{{ myName.name }}</b></span>
      <span v-if="theirName">, I am playing <b>{{ theirName.name }}</b></span>
      <span v-if="iAmAgile()">I am <b>Agile</b></span>
      <span v-if="iAmNotAgile()"> and I am <b>not Agile</b></span>
      <button v-if="!gameStarted" class="name btn btn-primary" @click="changeGame()">
        Change
      </button>
    </div>
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
