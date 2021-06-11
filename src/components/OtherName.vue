<template>
  <div class="other-name" v-if="!showAbout">
    <div v-if="myName && !theirName" class="need-other">
      <i>You now need to get another player to join the same game...</i>
      <i class="fas fa-question-circle" title="Both players need to set the same game to play" />
    </div>
    <div v-if="myName && theirName" class="playing">
      I am playing {{ theirName.name }}
    </div>
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
    vertical-align: top;

    .need-other, .playing {
      width: 255px;
      color: #fff;
      font-weight: bold;

      .fas {
        margin-left: 6px;
        color: gold;
      }
    }

    .playing {
      font-style: italic;
      color: #fff;
      padding: 12px 0 0 30px;
      text-align: left;
    }
  }
</style>
