import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alert: {
      open: false,
      type: 'info',
      text: ''
    }
  },
  mutations: {
    openAlert(state, data) {
      state.alert = data;
    }
  },
  actions: {
    openAlert({ commit }, data) {
      commit('openAlert', data);
    }
  },
  modules: {
  }
})
