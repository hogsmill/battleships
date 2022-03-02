<template>
  <div class="game-name" v-if="!showAbout">
    <button class="name btn btn-primary" :class="{ 'game-set': gameName }" :disabled="gameStarted" @click="show">
      Set Game Name
    </button>
    <br>
    <span v-if="gameName" class="game-name-info">({{ gameName }})</span>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameStarted() {
      return this.$store.getters.getGameStarted
    }
  },
  methods: {
    show() {
      this.$store.dispatch('showModal', 'setGame')
    }
  }
}
</script>

<style lang="scss">

.game-name {
  width: 200px;
  display: inline-block;
  vertical-align: top;

  .game-set {
    background-color: #f8f9fa;
    color: #2c3e50;
  }

  .game-name-info {
    color: #fff;
    font-style: italic;
  }
}
.set-game-name {

  #game-name {
    display: inline-block;
    width: 30%;
    margin-right: 6px;
  }
}
</style>
