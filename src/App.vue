<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>

    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-if="!showAbout" class="main">
      <h1>Agile Battleships</h1>
      <div class="names">
        <MyName v-bind:socket="socket" />
        <GameName  v-bind:socket="socket" />
      </div>
      <div class="container">
        <div class="row">
          <Board v-bind:socket="socket" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

import Header from "./components/Header.vue";
import AboutView from "./components/about/AboutView.vue";

import GameName from "./components/GameName.vue";
import MyName from "./components/MyName.vue";
import Board from "./components/Board.vue";

export default {
  name: 'App',
  components: {
    appHeader: Header,
    AboutView,
    GameName,
    MyName,
    Board
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout;
    },
    myName() {
      return this.$store.getters.getMyName;
    },
    gameName() {
      return this.$store.getters.getGameName;
    }
  },
  created() {
    var host = "77.68.122.69"
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    var connStr = "http://" + host + ":3008"
    console.log("Connecting to: " + connStr)
    this.socket = io(connStr)

    var myName = localStorage.getItem("myName-bs")
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch("setMyName", myName)
    }

    var gameName = localStorage.getItem("gameName-bs")
    if (gameName) {
      this.socket.emit("loadGame", {gameName: gameName})
      this.$store.dispatch("updateGameName", gameName)
    }

    this.socket.on("loadGame", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("loadGame", data)
      }
    })

    this.socket.on("updatePlayers", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updatePlayers", data)
      }
    })
  }
}
</script>

<style lang="scss">

  .main {
    position: relative;

    .names {
      width: 300px;
      position: absolute;
      top: 9px;
      right: 0;
    }
  }

</style>
