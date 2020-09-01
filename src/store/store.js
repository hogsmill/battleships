import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    showAbout: false,
    myName: '',
    theirName: '',
    gameName: '',
    gameState: []
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
    getGameState: (state) => {
      return state.gameState;
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
      state.gameState = payload.gameState;
    },
    updateGameName: (state, payload) => {
      state.gameName = payload;
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
    }
  }
});
