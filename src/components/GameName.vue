<template>
  <div class="game-name" v-if="!showAbout">
    <button class="name btn btn-primary" :class="{ 'game-set': gameName }" :disabled="gameStarted" @click="show">
      Set Game Name
    </button>
    <span v-if="gameName" class="game-name-info">({{ gameName }})</span>

    <modal name="set-game-name" :height="120" :classes="['rounded', 'set-game-name']">
      <div class="mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Game Name</h4>
        <div class="set-game-name">
          <input type="text" id="game-name" class="form-control">
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveGameName">
            Save
          </button>
        </div>
      </div>
    </modal>
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
    show () {
      this.$modal.show('set-game-name')
    },
    hide () {
      this.$modal.hide('set-game-name')
    },
    saveGameName: function() {
      const gameName = document.getElementById('game-name').value
      this.$store.dispatch('updateGameName', gameName)
      localStorage.setItem('gameName-bs', gameName)
      bus.$emit('sendLoadGame', {gameName: this.gameName})
      this.hide()
    }
  },
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
