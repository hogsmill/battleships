import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    showAbout: false,
    myName: '',
    theirName: '',
    gameName: '',
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
    }
  },
  mutations: {
    updateShowAbout: (state, payload) => {
      state.showAbout = payload;
    },
    setMyName: (state, payload) => {
      state.myName = payload;
    },
    updatePlayers: (state, payload) => {
      state.players = payload.players;
      var i = 0;
      while (i < state.players.length) {
        if (state.players[i].id != state.myName.id) {
          state.theirName = state.players[i]
        }
        i++
      }
      console.log(state)
    },
    loadGame: (state, payload) => {
      state.players = payload.players;
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
    updatePlayers: ({ commit }, payload) => {
      commit("updatePlayers", payload);
    },
    loadGame: ({ commit }, payload) => {
      commit("loadGame", payload);
    },
    updateGameName: ({ commit }, payload) => {
      commit("updateGameName", payload);
    }
  }
});
