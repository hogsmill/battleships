<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>

    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-if="!showAbout" class="main">
      <h1>Agile Battleships</h1>
      <div v-if="isHost" class="connections">
        Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
      </div>
      <div class="names">
        <GameName  v-bind:socket="socket" />
        <MyName v-bind:socket="socket" />
        <OtherName />
        <Agile v-bind:socket="socket" />
      </div>
      <div class="container">
        <div class="row">
          <Moves />
          <Board v-bind:socket="socket" />
        </div>
      </div>
    </div>

    <modal name="game-over" :height="150" :classes="['rounded', 'game-over']">
      <div class="mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>
          Game Over:
          <span v-if="result.allMovesDone">{{getScore()}}</span>
          <span v-if="result.player == 0">{{getScore()}}</span>
          <span v-if="result.player == 1">{{getScore()}}</span>
        </h4>
        <div>
          <button class="btn btn-sm btn-secondary smaller-font" @click="hide">OK</button>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
import io from "socket.io-client";

import params from './lib/params.js'

import Header from "./components/Header.vue";
import AboutView from "./components/about/AboutView.vue";

import GameName from "./components/GameName.vue";
import MyName from "./components/MyName.vue";
import OtherName from "./components/OtherName.vue";
import Agile from "./components/Agile.vue";
import Moves from "./components/Moves.vue";
import Board from "./components/Board.vue";

export default {
  name: 'App',
  components: {
    appHeader: Header,
    AboutView,
    GameName,
    MyName,
    OtherName,
    Agile,
    Moves,
    Board
  },
  methods: {
    show () {
      this.$modal.show('game-over');
    },
    hide () {
      this.$modal.hide('game-over');
    },
    getScore() {
      var result = ''
      if (this.gemeSet) {
        var score0 = this.gameState[0].score
        var score1 = this.gameState[1].score
        var winner, loser

        if (score0 == score1) {
          result = 'Draw - ' + this.gameState[0].name + ':' + this.gameState[0].score + ', ' + this.gameState[1].name + ':' + this.gameState[1].score
        } else {
          if (score0 > score1) {
            winner = this.gameState[0]
            loser = this.gameState[1]
          } else {
            winner = this.gameState[1]
            loser = this.gameState[0]
          }
          result = winner.name + ' beats ' + loser.name + ' ' + winner.score + '/' + loser.score
        }
      }
      return result
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    showAbout() {
      return this.$store.getters.getShowAbout;
    },
    myName() {
      return this.$store.getters.getMyName;
    },
    otherName() {
      return this.$store.getters.getOtherName;
    },
    gameName() {
      return this.$store.getters.getGameName;
    },
    gameSet() {
      return this.$store.getters.gameSet;
    },
    gameState() {
      return this.$store.getters.getGameState;
    },
    result() {
      return this.$store.getters.getResult;
    },
    connections() {
      return this.$store.getters.getConnections;
    }
  },
  created() {
    var self = this
    var host = "77.68.122.69"
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    var connStr = "http://" + host + ":3008"
    console.log("Connecting to: " + connStr)
    this.socket = io(connStr)

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

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

    if (myName && gameName) {
      this.socket.emit("addPlayer", {gameName: gameName, player: myName})
    }

    this.socket.on("loadGame", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("loadGame", data)
      }
    })

    this.socket.on("updateGameState", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("updateGameState", data)
      }
    })

    this.socket.on("removePlayer", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("removePlayer", data)
      }
    })

    this.socket.on("gameOver", (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch("gameOver", data)
        self.show()
      }
    })

    this.socket.on('updateConnections', (data) => {
      this.$store.dispatch('updateConnections', data)
    })
  }
}
</script>

<style lang="scss">

  .connections {
    text-align: right;
    padding-right: 6px;
    margin-bottom: 12px;
  }

  .main {
    position: relative;

    .names {
      height: 50px;
      text-align: center;
    }
  }

</style>
