<template>
  <div id="app" class="mb-4">
    <appHeader />
    <div class="main">
      <h1>Agile Simulation Labs</h1>
      <div class="container">
        <div class="row">
          Content
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    appHeader: Header
  },
  computed: {
  },
  created() {
    const self = this
    let host = '77.68.122.69'
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    const connStr = 'http://' + host + ':3013'
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)
  },
  methods: {
  }
}
</script>

<style lang="scss">


</style>
