import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function agileSet(state) {
  return state.gameState.length == 2 && Object.keys(state.gameState[0]).find((k) => {
    return k == 'agile'
  })
}

export const store = new Vuex.Store({
  state: {
    thisGame: 'Agile Battleships',
    session: null,
    userName: '',
    admin: false,
    connections: 0,
    currentTab: 'game',
    walkThrough: false,
    myName: '',
    theirName: '',
    gameName: '',
    boats: [],
    totalScore: 0,
    maxMoves: 40,
    gameState: [],
    result: {},
    results: [],
    games: [],
    watchingGame: {}
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    lsSuffix: (state) => {
      return 'bs'
    },
    getSession: (state) => {
      return state.session
    },
    getUserName: (state) => {
      return state.userName
    },
    getAdmin: (state) => {
      return state.admin
    },
    getHost: (state) => {
      return state.host
    },
    getCurrentTab: (state) => {
      return state.currentTab
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getGames: (state) => {
      return state.games
    },
    getResults: (state) => {
      return state.results
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
    getGameReady: (state) => {
      return state.gameState.length == 2 && state.gameState[0].board.length == 5 && state.gameState[1].board.length == 5
    },
    getAgileSet: (state) => {
      return agileSet(state)
    },
    getGameName: (state) => {
      return state.gameName
    },
    getGameStarted: (state) => {
      return state.gameState.length == 2 && (state.gameState[0].moves.length > 0 || state.gameState[1].moves.length > 0)
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
    getWatchingGame: (state) => {
      return state.watchingGame
    },
    getConnections: (state) => {
      return state.connections
    }
  },
  mutations: {
    updateLogin: (state, payload) => {
      state.session = payload.session
      state.userName = payload.userName
      state.admin = payload.loggedInAsAdmin
    },
    updateHost: (state, payload) => {
      state.host = payload
    },
    updateTab: (state, payload) => {
      state.currentTab = payload
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
    loadResults: (state, payload) => {
      state.results = payload
    },
    loadGames: (state, payload) => {
      state.games = payload.games
    },
    loadGame: (state, payload) => {
      state.boats = payload.boats
      state.totalScore = payload.totalScore
      state.gameState = payload.gameState
    },
    gameDeleted: (state, payload) => {
      state.myName = ''
      state.theirName = ''
      state.gameName = ''
      state.boats = []
      state.totalScore = 0
      state.maxMoves = 40
      state.gameState = []
      state.result = {}
    },
    updateGameName: (state, payload) => {
      state.gameName = payload
    },
    gameOver: (state, payload) => {
      state.result = payload.result
    },
    setWatchingGame: (state, payload) => {
      state.watchingGame = payload.game
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    }
  },
  actions: {
    updateLogin: ({ commit }, payload) => {
      commit('updateLogin', payload)
    },
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateTab: ({ commit }, payload) => {
      commit('updateTab', payload)
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
    loadResults: ({ commit }, payload) => {
      commit('loadResults', payload)
    },
    loadGames: ({ commit }, payload) => {
      commit('loadGames', payload)
    },
    loadGame: ({ commit }, payload) => {
      commit('loadGame', payload)
    },
    gameDeleted: ({ commit }, payload) => {
      commit('gameDeleted', payload)
    },
    updateGameName: ({ commit }, payload) => {
      commit('updateGameName', payload)
    },
    gameOver: ({ commit }, payload) => {
      commit('gameOver', payload)
    },
    setWatchingGame: ({ commit }, payload) => {
      commit('setWatchingGame', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  }
})
