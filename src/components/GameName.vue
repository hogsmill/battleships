<template>
  <div class="game-name" v-if="!showAbout">
      <button class="name btn btn-sm btn-secondary smaller-font" v-if="!gameName" @click="show">Set Game Name</button>
      <span v-if="gameName" @click="show" class="name mr-2 mt-2 pointer p-2 bg-light">Game: {{gameName}}</span>
      <span v-if="gameName" title="Restart Game" class="restart" @click="restartGame">&#8635;</span>

    <modal name="set-game-name" :height="120" :classes="['rounded', 'set-game-name']">
      <div class="mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Game Name</h4>
        <div class="set-game-name">
          <input type="text" id="game-name" class="form-control" />
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveGameName">Save</button>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  methods: {
    show () {
      this.$modal.show('set-game-name');
    },
    hide () {
      this.$modal.hide('set-game-name');
    },
    saveGameName: function() {
      var gameName = document.getElementById('game-name').value
      this.$store.dispatch("updateGameName", gameName)
      localStorage.setItem("gameName-bs", gameName);
      this.socket.emit("loadGame", {gameName: this.gameName})
      this.hide()
    },
    restartGame() {
      var restartGame = confirm("Are you sure you want to re-start this game?")
      if (restartGame) {
        this.socket.emit("restartGame", {gameName: this.gameName})
      }
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
}
</script>

<style lang="scss">

.game-name {
  width: 120px;
  display: inline-block;

  .restart:hover {
    cursor: pointer;
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
