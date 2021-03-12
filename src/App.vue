<template>
  <div id="app" class="mb-4">
    <appHeader />
    <WalkThroughView />
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-if="!showAbout" class="main">
      <div v-if="isHost" class="connections">
        Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
      </div>
      <div class="names">
        <GameName />
        <MyName />
        <OtherName />
        <Agile />
      </div>
      <div class="container">
        <div class="row">
          <Moves />
          <Board />
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
          <span v-if="result.allMovesDone">{{ getScore() }}</span>
          <span v-if="result.player == 0">{{ getScore() }}</span>
          <span v-if="result.player == 1">{{ getScore() }}</span>
        </h4>
        <div>
          <button class="btn btn-sm btn-secondary smaller-font" @click="hide">
            OK
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import bus from './socket.js'

import params from './lib/params.js'

import Header from './components/Header.vue'
import AboutView from './components/about/AboutView.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'

import GameName from './components/GameName.vue'
import MyName from './components/MyName.vue'
import OtherName from './components/OtherName.vue'
import Agile from './components/Agile.vue'
import Moves from './components/Moves.vue'
import Board from './components/Board.vue'

export default {
  name: 'App',
  components: {
    appHeader: Header,
    AboutView,
    WalkThroughView,
    GameName,
    MyName,
    OtherName,
    Agile,
    Moves,
    Board
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    myName() {
      return this.$store.getters.getMyName
    },
    otherName() {
      return this.$store.getters.getOtherName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameSet() {
      return this.$store.getters.gameSet
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    result() {
      return this.$store.getters.getResult
    },
    connections() {
      return this.$store.getters.getConnections
    }
  },
  created() {
    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    let myName = localStorage.getItem('myName-bs')
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch('setMyName', myName)
    }

    const gameName = localStorage.getItem('gameName-bs')
    if (gameName) {
      bus.$emit('sendLoadGame', {gameName: gameName})
      this.$store.dispatch('updateGameName', gameName)
    }

    if (myName && gameName) {
      bus.$emit('sendAddPlayer', {gameName: gameName, player: myName})
    }

    bus.$on('loadGame', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('loadGame', data)
      }
    })

    bus.$on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
      }
    })

    bus.$on('removePlayer', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('removePlayer', data)
      }
    })

    bus.$on('gameOver', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('gameOver', data)
        self.show()
      }
    })

    bus.$on('updateConnections', (data) => {
      this.$store.dispatch('updateConnections', data)
    })
  },
  methods: {
    show () {
      this.$modal.show('game-over')
    },
    hide () {
      this.$modal.hide('game-over')
    },
    getScore() {
      let result = ''
      if (this.gemeSet) {
        const score0 = this.gameState[0].score
        const score1 = this.gameState[1].score
        let winner, loser

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
  }
}
</script>

<style lang="scss">

  body {
    background-image: url("./assets/img/sea.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    min-height: 700px;
  }

  h1, h3 {
    color: #fff;
  }
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
