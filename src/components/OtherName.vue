<template>
  <div class="other-name" v-if="!showAbout">
    <div v-if="myName && !theirName" class="need-other">
      <i>You now need to get another player to join the same game...</i>
    </div>
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
    myName() {
      return this.$store.getters.getMyName
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
    display: inline-block;

    .need-other {
      position: relative;
      top: 12px;
      width: 245px;
      color: #fff;
      font-weight: bold;
    }
  }
</style>
