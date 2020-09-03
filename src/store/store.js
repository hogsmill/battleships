import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    showAbout: false,
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
    getShowAbout: (state) => {
      return state.showAbout;
    },
    getMyName: (state) => {
      return state.myName;
    },
    getTheirName: (state) => {
      return state.theirName;
    },
    getGameName: (state) => {
      return state.gameName;
    },
    getBoats: (state) => {
      return state.boats;
    },
    getMaxMoves: (state) => {
      return state.maxMoves;
    },
    getTotalScore: (state) => {
      return state.totalScore;
    },
    getGameState: (state) => {
      return state.gameState;
    },
    gameSet: (state) => {
      return state.gameState.length == 2 && state.myName
    },
    getResult: (state) => {
      return state.result;
    }
  },
  mutations: {
    updateShowAbout: (state, payload) => {
      state.showAbout = payload;
    },
    setMyName: (state, payload) => {
      state.myName = payload;
    },
    updateGameState: (state, payload) => {
      state.gameState = payload.gameState;
      var i = 0;
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
      state.boats = payload.boats;
      state.totalScore = payload.totalScore;
      state.gameState = payload.gameState;
    },
    updateGameName: (state, payload) => {
      state.gameName = payload;
    },
    gameOver: (state, payload) => {
      state.result = payload.result;
    }
  },
  actions: {
    updateShowAbout: ({ commit }, payload) => {
      commit("updateShowAbout", payload);
    },
    setMyName: ({ commit }, payload) => {
      commit("setMyName", payload);
    },
    updateGameState: ({ commit }, payload) => {
      commit("updateGameState", payload);
    },
    removePlayer: ({ commit }, payload) => {
      commit("removePlayer", payload);
    },
    loadGame: ({ commit }, payload) => {
      commit("loadGame", payload);
    },
    updateGameName: ({ commit }, payload) => {
      commit("updateGameName", payload);
    },
    gameOver: ({ commit }, payload) => {
      commit("gameOver", payload);
    }
  }
});
