<template>
  <div class="my-name" v-if="!showAbout">
    <button class="btn btn-primary" v-if="!myName" :disabled="gameStarted" @click="show">
      Set My Name
    </button>
    <span v-if="myName" @click="show" class="rounded mr-2 mt-2 pointer p-2 bg-light">I am: {{ myName.name }}</span>

    <modal name="set-my-name" :height="120" :classes="['rounded', 'set-my-name']">
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
    </modal>
  </div>
</template>

<script>
import bus from '../socket.js'

import { v4 as uuidv4 } from 'uuid'

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
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    show () {
      this.$modal.show('set-my-name')
    },
    hide () {
      this.$modal.hide('set-my-name')
    },
    saveMyName: function() {
      const oldName = this.myName
      const newName = document.getElementById('my-name').value
      let myNameData
      if (!oldName.id) {
        const uuid = uuidv4()
        myNameData = {id: uuid, name: newName}
        bus.$emit('sendAddPlayer', {gameName: this.gameName, player: myNameData, move: 0})
        this.$store.dispatch('setMyName', myNameData)
      } else {
        myNameData = {id: this.myName.id, name: newName}
        this.$store.dispatch('setMyName', myNameData)
        bus.$emit('sendChangeName', {gameName: this.gameName, name: oldName, newName: newName})
      }
      localStorage.setItem('myName-bs', JSON.stringify(myNameData))
      this.hide()
    }
  }
}
</script>

<style lang="scss">

.my-name {
  width: 150px;
  display: inline-block;

  .cross {
    color: red;

    &:hover {
      cursor: pointer;
    }
  }
}

.set-my-name {
  height: 120px;

  #my-name {
    display: inline-block;
    width: 30%;
    margin-right: 6px;
  }
}
</style>
