<template>
  <div class="my-name" v-if="!showAbout">
    <button class="btn btn-sm btn-secondary smaller-font" v-if="!myName" @click="show">Set My Name</button>
    <span v-if="myName" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">I am: {{myName.name}}</span>
    <span class="cross" title="leave this game" @click="leaveGame()">&#10006;</span>

    <modal name="set-my-name" :height="120" :classes="['rounded', 'set-my-name']">
      <div class="mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Name</h4>
        <div class="set-my-name">
          <input type="text" id="my-name" class="form-control" />
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveMyName">Save</button>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
  props: [
    'socket'
  ],
  methods: {
    show () {
      this.$modal.show('set-my-name');
    },
    hide () {
      this.$modal.hide('set-my-name');
    },
    saveMyName: function() {
      var oldName = this.myName
      var newName = document.getElementById('my-name').value
      var myNameData
      if (!oldName.id) {
        var uuid = uuidv4()
        myNameData = {id: uuid, name: newName}
        this.socket.emit("addPlayer", {gameName: this.gameName, player: myNameData})
        this.$store.dispatch("setMyName", myNameData)
      } else {
        myNameData = {id: this.myName.id, name: newName}
        this.$store.dispatch("setMyName", myNameData)
        this.socket.emit("changeName", {gameName: this.gameName, name: oldName, newName: newName})
      }
      localStorage.setItem("myName-bs", JSON.stringify(myNameData));
      this.hide()
    },
    leaveGame() {
      var ok = confirm("Are you sure you want to leave this game?")
      if (ok) {
        localStorage.removeItem("myName-bs");
        this.socket.emit("removePlayer", {gameName: this.gameName, player: this.myName})
      }
    }
  },
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    }
  }
}
</script>

<style lang="scss">

.my-name {
  width: 120px;
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
