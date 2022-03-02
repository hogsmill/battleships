<template>
  <div />
</template>

<script>
import params from '../../lib/params.js'

export default {
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('showModal', 'walkThrough')
    }
  }
}
</script>

<style lang="scss">

  .buttons {
    padding: 6px;
  }

  #walk-through p {
    margin-left: 12px;
    margin-right: 12px;
  }

  .walkthrough-button {
    background-color: #6c757d;
    width: 150px;
    color: #fff;
    padding: .25rem .5rem;
    margin: 0 auto 12px auto;
  }

  .game {
    background-repeat: no-repeat;
    background-size: contain;
    background-position-x: center;
    width: 500px;
    height: 100px;
    margin: 0 auto;
    border: 1px solid #ccc;
    margin-bottom: 12px;

    &.setup {
      background-image: url("../../assets/img/setup.jpg");
    }
    &.place-boat {
      background-image: url("../../assets/img/place.jpg");
    }
  }

</style>
