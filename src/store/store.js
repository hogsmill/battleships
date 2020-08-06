import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    showAbout: false,
    myName: '',
    gameName: '',
    players: [],
  },
  getters: {
    getShowAbout: (state) => {
      return state.showAbout;
    },
    getMyName: (state) => {
      return state.myName;
    },
    getGameName: (state) => {
      return state.gameName;
    },
    getPlayers: (state) => {
      return state.players
    }
  },
  mutations: {
    updateShowAbout: (state, payload) => {
      state.showAbout = payload;
    },
    setMyName: (state, payload) => {
      state.myName = payload;
    },
    loadGame: (state, payload) => {
      state.players = payload.players;
    },
    updateGameName: (state, payload) => {
      state.gameName = payload;
    },
    updatePlayers: (state, payload) => {
      state.players = payload.players
    }
  },
  actions: {
    updateShowAbout: ({ commit }, payload) => {
      commit("updateShowAbout", payload);
    },
    setMyName: ({ commit }, payload) => {
      commit("setMyName", payload);
    },
    loadGame: ({ commit }, payload) => {
      commit("loadGame", payload);
    },
    updateGameName: ({ commit }, payload) => {
      commit("updateGameName", payload);
    },
    updatePlayers: ({ commit }, payload) => {
      commit("updatePlayers", payload);
    }
  }
});
