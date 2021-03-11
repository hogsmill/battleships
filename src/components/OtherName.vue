<template>
  <div class="other-name" v-if="!showAbout">
    <span v-if="gameSet" class="rounded mr-2 mt-2 pointer p-2 bg-light">I am playing: {{ theirName.name }}</span>
  </div>
</template>

<script>
export default {
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
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
    theirName() {
      return this.$store.getters.getTheirName
    }
  }
}
</script>

<style lang="scss">
  .other-name {
    width: 200px;
    display: inline-block
  }
</style>
