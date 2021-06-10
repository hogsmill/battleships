<template>
  <div class="headerString">
    <div>
      <span v-if="myName">I am <b>{{ myName.name }}</b></span>
      <span v-if="theirName">, I am playing <b>{{ theirName.name }}</b></span>
      <span v-if="iAmAgile()">I am <b>Agile</b></span>
      <span v-if="iAmNotAgile()"> and I am <b>not Agile</b></span>
      <button>
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
