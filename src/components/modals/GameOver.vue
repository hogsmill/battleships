<template>
  <vue-final-modal name="game-over" classes="modal-container" content-class="vfm__content modal-content game-over" v-model="modals['gameOver']">
    <div class="mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>
        Game Over:
        <span v-if="getScore().length">{{ getScore()[0] }}</span>
        <br>
        <span v-if="getScore().length > 1">{{ getScore()[1] }}</span>
      </h4>
      <div>
        <button class="btn btn-sm btn-secondary smaller-font" @click="hide">
          OK
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import { $vfm, VueFinalModal } from 'vue-final-modal'

import Facilitation from './walkThrough/Facilitation.vue'

export default {
  components: {
    VueFinalModal
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    gameSet() {
      return this.$store.getters.getGameSet
    },
    gameState() {
      return this.$store.getters.getGameState
    },
    result() {
      return this.$store.getters.getResult
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'gameOver')
    },
    getScore() {
      const result = []
      if (this.gameSet) {
        const score0 = this.gameState[0].score
        const score1 = this.gameState[1].score
        let winner, loser

        if (score0 == score1) {
          result = [
            'Draw - ' + this.gameState[0].name + ':' + this.gameState[0].score + ', ' + this.gameState[1].name + ':' + this.gameState[1].score,
            ''
          ]
        } else {
          if (score0 > score1) {
            winner = this.gameState[0]
            loser = this.gameState[1]
          } else {
            winner = this.gameState[1]
            loser = this.gameState[0]
          }
          result.push(winner.name + ' beats ' + loser.name + ' ' + winner.score + '/' + loser.score)
          if (winner.agile == 'yes') {
            result.push('Agile wins again...')
          } else {
            result.push('Agile Loses!')
          }
        }
      }
      return result
    }
  }
}
</script>
