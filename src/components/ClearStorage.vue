<template>
  <i class="fas fa-store-alt-slash clear-storage" @click="clearLocalStorage()" />
</template>

<script>
import ls from '../lib/localStorage.js'

export default {
  computed: {
    lsSuffix() {
      return this.$store.getters.lsSuffix
    }
  },
  methods: {
    clearLocalStorage() {
      if (confirm('Clear all your details fron this game?')) {
        ls.clear(this.lsSuffix)
        location.reload()
      }
    }
  }
}
</script>

<style>
  .clear-storage {
    z-index: 20;
    float: right;
    margin-right: 4px;
  }
</style>
