<template>
  <vue-final-modal name="game-over" classes="modal-container" content-class="vfm__content modal-content game-over" v-model="modals['setGame']">
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
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { $vfm, VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'setGame')
    },
    saveGameName() {
      const gameName = document.getElementById('game-name').value
      this.$store.dispatch('updateGameName', gameName)
      localStorage.setItem('gameName-bs', gameName)
      bus.emit('sendLoadGame', {gameName: this.gameName})
      this.hide()
    }
  }
}
</script>
