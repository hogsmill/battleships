<template>

  <div class="who-is-agile">
    <button class="btn btn-sm btn-secondary smaller-font" :disabled="gameState.length < 2" v-if="!agileSet()" @click="setAgile()">Who is Agile?</button>
    <span v-if="iAmAgile()" class="mr-2 mt-2 pointer p-2 bg-light">I am Agile</span>
    <span v-if="iAmNotAgile()" class="mr-2 mt-2 pointer p-2 bg-light">I am not Agile</span>
  </div>

</template>

<script>
import game from '../lib/gameState.js'

export default {
  props: [
    'socket'
  ],
  methods: {
    agileSet() {
      return this.gameState.length == 2 && this.gameState[0].agile
    },
    iAmAgile() {
      return this.agileSet() && game.myBoard(this.gameState, this.myName).agile == 'yes'
    },
    iAmNotAgile() {
      return this.agileSet() && game.myBoard(this.gameState, this.myName).agile == 'no'
    },
    setAgile() {
      this.socket.emit("setAgile", {gameName: this.gameName})
    }
  },
  computed: {
    myName() {
      return this.$store.getters.getMyName;
    },
    gameName() {
      return this.$store.getters.getGameName;
    },
    gameState() {
      return this.$store.getters.getGameState;
    }
  }
}
</script>

<style lang="scss">

  .who-is-agile {
    width: 125px;
    display: inline-block;
  }

</style>
