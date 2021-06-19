<template>
  <td class="watch-board">
    <h3 :class="{ 'no-header': !player, 'next-go': player.nextGo }">
      {{ player.name }}'s Board <i v-if="player.nextGo" :title="player.name + 's go next'" class="fas fa-check-circle" />
    </h3>
    <table class="board their-board">
      <tr>
        <td class="header" />
        <td class="header" v-for="(column, col) in columns" :key="col">
          {{ column }}
        </td>
      </tr>
      <tr v-for="(row, r) in rows" :key="r">
        <td class="header">
          {{ row }}
        </td>
        <td :class="hitOrMissThem(r, c).class" class="their-board-cell" v-for="(col, c) in columns" :key="c" :id="rows[r] + columns[c]">
          {{ hitOrMissThem(r, c).boat }}
        </td>
      </tr>
    </table>
  </td>
</template>

<script>
import board from '../../lib/board.js'

export default {
  props: [
    'player'
  ],
  data() {
    return {
      columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    }
  },
  computed: {
    gameSet() {
      return this.$store.getters.getGameSet
    },
    result() {
      return this.$store.getters.getResult
    }
  },
  methods: {
    hitOrMissThem(r, c) {
      const agile = this.player.agile
      const moves = this.player.moves
      return board.hitOrMiss(r, c, moves, agile, this.result)
    }
  }
}
</script>

<style lang="scss">
  .watch-board {
    .their-board-cell {
      border: 1px solid #eee !important;
    }

    &.played, &.missed, &.hit {
      border: none !important;
    }
  }
</style>
