import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function agileSet(state) {
  return state.gameState.length == 2 && state.gameState[0].agile
}

export const store = new Vuex.Store({
  state: {
    thisGame: 'Agile Battleships',

    connections: 0,
    showAbout: false,
    walkThrough: false,
    myName: '',
    theirName: '',
    gameName: '',
    boats: [],
    totalScore: 0,
    maxMoves: 40,
    gameState: [],
    result: {}
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    lsSuffix: (state) => {
      return 'bs'
    },
    getHost: (state) => {
      return state.host
    },
    getShowAbout: (state) => {
      return state.showAbout
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getMyName: (state) => {
      return state.myName
    },
    getMyPlayer: (state) => {
      return state.gameState.find((p) => {
        return p.id == state.myName.id
      })
    },
    getTheirName: (state) => {
      return state.theirName
    },
    getGameSet: (state) => {
      return state.gameName && state.myName && agileSet(state)
    },
    getAgileSet: (state) => {
      return agileSet(state)
    },
    getGameName: (state) => {
      return state.gameName
    },
    getGameStarted: (state) => {
      return false
      //return state.gameState[0].moves.length || state.gameState[1].moves.length
    },
    getBoats: (state) => {
      return state.boats
    },
    getMaxMoves: (state) => {
      return state.maxMoves
    },
    getTotalScore: (state) => {
      return state.totalScore
    },
    getGameState: (state) => {
      return state.gameState
    },
    gameSet: (state) => {
      return state.gameState.length == 2 && state.myName
    },
    getResult: (state) => {
      return state.result
    },
    getConnections: (state) => {
      return state.connections
    }
  },
  mutations: {
    updateHost: (state, payload) => {
      state.host = payload
    },
    updateShowAbout: (state, payload) => {
      state.showAbout = payload
    },
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload
    },
    setMyName: (state, payload) => {
      state.myName = payload
    },
    updateGameState: (state, payload) => {
      state.gameState = payload.gameState
      let i = 0
      while (i < state.gameState.length) {
        if (state.gameState[i].id != state.myName.id) {
          state.theirName = state.gameState[i]
        }
        i++
      }
    },
    removePlayer: (state, payload) => {
      if (state.myName.id == payload.player.id) {
        state.myName = ''
      }
      if (state.theirName.id == payload.player.id) {
        state.theirName = ''
      }
    },
    loadGame: (state, payload) => {
      state.boats = payload.boats
      state.totalScore = payload.totalScore
      state.gameState = payload.gameState
    },
    updateGameName: (state, payload) => {
      state.gameName = payload
    },
    gameOver: (state, payload) => {
      state.result = payload.result
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    }
  },
  actions: {
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateShowAbout: ({ commit }, payload) => {
      commit('updateShowAbout', payload)
    },
    updateWalkThrough: ({ commit }, payload) => {
      commit('updateWalkThrough', payload)
    },
    setMyName: ({ commit }, payload) => {
      commit('setMyName', payload)
    },
    updateGameState: ({ commit }, payload) => {
      commit('updateGameState', payload)
    },
    removePlayer: ({ commit }, payload) => {
      commit('removePlayer', payload)
    },
    loadGame: ({ commit }, payload) => {
      commit('loadGame', payload)
    },
    updateGameName: ({ commit }, payload) => {
      commit('updateGameName', payload)
    },
    gameOver: ({ commit }, payload) => {
      commit('gameOver', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  }
})
