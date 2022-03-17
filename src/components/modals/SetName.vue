<template>
  <vue-final-modal name="game-over" classes="modal-container" content-class="vfm__content modal-content game-over" v-model="modals['setName']">
    <div class="mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>Enter Your Name</h4>
      <div class="set-my-name">
        <input type="text" id="my-name" class="form-control">
        <button class="btn btn-sm btn-secondary smaller-font" @click="saveMyName">
          Save
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { v4 as uuidv4 } from 'uuid'

import { VueFinalModal } from 'vue-final-modal'

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
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'setName')
    },
    saveMyName: function() {
      const oldName = this.myName
      const newName = document.getElementById('my-name').value
      let myNameData
      if (!oldName.id) {
        const uuid = uuidv4()
        myNameData = {id: uuid, name: newName}
        bus.emit('sendAddPlayer', {gameName: this.gameName, player: myNameData, move: 0})
        this.$store.dispatch('setMyName', myNameData)
      } else {
        myNameData = {id: this.myName.id, name: newName}
        this.$store.dispatch('setMyName', myNameData)
        bus.emit('sendChangeName', {gameName: this.gameName, name: oldName, newName: newName})
      }
      localStorage.setItem('myName-bs', JSON.stringify(myNameData))
      this.hide()
    }
  }
}
</script>
