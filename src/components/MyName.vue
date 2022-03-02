<template>
  <div class="my-name" v-if="!showAbout">
    <button class="btn btn-primary" :class="{ 'name-set': gameName }" :disabled="gameStarted" @click="show">
      Set My Name
    </button>
    <br>
    <span v-if="myName" class="my-name-info">({{ myName.name }})</span>
  </div>
</template>

<script>
import bus from '../socket.js'

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
      this.$store.dispatch('showModal', 'setName')
    },
    hide () {
      this.$modal.hide('set-my-name')
    },

  }
}
</script>

<style lang="scss">

.my-name {
  width: 150px;
  display: inline-block;
  vertical-align: top;

  .name-set {
    background-color: #f8f9fa;
    color: #2c3e50;
  }

  .my-name-info {
    color: #fff;
    font-style: italic;
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
