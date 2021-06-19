<template>
  <div class="game-watch">
    <div>
      Game:
      <select id="game-select" @change="setWatchingGame()">
        <option value="">
          -- Select --
        </option>
        <option v-for="(game, index) in games" :key="index">
          {{ game.gameName }}
        </option>
      </select>
    </div>
    <table v-if="watchingGame.gameState" class="game-watch-table">
      <tbody>
        <tr>
          <td>
            <Board :player="watchingGame.gameState[0]" />
          </td>
          <td>
            <Board :player="watchingGame.gameState[1]" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import bus from '../socket.js'

import Board from './gameWatch/Board.vue'

export default {
  components: {
    Board
  },
  computed: {
    games() {
      return this.$store.getters.getGames
    },
    watchingGame() {
      return this.$store.getters.getWatchingGame
    },
  },
  created() {
    bus.$emit('sendLoadGames')

    bus.$on('loadGames', (data) => {
      this.$store.dispatch('loadGames', data)
    })

    bus.$on('updateWatchingGame', (data) => {
      if (this.watchingGame.gameName == data.game.gameName) {
        this.$store.dispatch('setWatchingGame', data)
      }
    })
  },
  methods: {
    setWatchingGame() {
      const gameName = document.getElementById('game-select').value
      const game = this.games.find((g) => {
        return g.gameName == gameName
      })
      this.$store.dispatch('setWatchingGame', {game, game})
    }
  }
}
</script>

<style lang="scss">
  .game-watch {

    td {
      border-color: #fff;
    }


    .game-watch-table {
      background: none;

      td {
        border: none;
      }
    }
  }
</style>
