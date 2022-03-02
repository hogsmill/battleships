<template>
  <div>
    <h2>Results</h2>
    <table>
      <thead>
        <tr>
          <td>
            Game
          </td>
          <td>
            Players
          </td>
          <td>
            Result
          </td>
          <td>
            Agile Won?
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, index) in results" :key="index">
          <td>
            {{ result.gameName }}
          </td>
          <td>
            <span v-if="result.players[0]">{{ result.players[0] }}</span>
            v
            <span v-if="result.players[1]">{{ result.players[1] }}</span>
          </td>
          <td>
            {{ result.result }}
          </td>
          <td>
            <span v-if="!result.result.allMovesDone">
              <i v-if="result.result.agile" class="fas fa-check" />
              <i v-if="!result.result.agile" class="fas fa-times" />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  computed: {
    results() {
      return this.$store.getters.getResults
    }
  },
  created() {
    bus.emit('sendLoadResults')

    bus.on('loadResults', (data) => {
    const d1 = JSON.parse(JSON.stringify(data[0]))
    const d2 = JSON.parse(JSON.stringify(data[0]))
    const d3 = JSON.parse(JSON.stringify(data[0]))
      const results = [d1, d2, d3]
      results[0].result = {win: true, allMovesDone: true}
      results[1].result = {win: true, player: 0, agile: true}
      results[2].result = {win: true, player: 1, agile: false}
      console.log(results)
      this.$store.dispatch('loadResults', results)
    })
  }
}
</script>

<style lang="scss">
  table {
    margin: 0 auto;
    background-color: #fff;

    td {
      padding: 6px;
      border: 1px solid #eee;

      .fas {
        font-size: x-large;

        &.fa-check {
          color: green;
        }

        &.fa-times {
          color: red;
        }
      }
    }
  }
</style>
