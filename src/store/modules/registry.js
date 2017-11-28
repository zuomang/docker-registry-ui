import axios from 'axios';
import Vue from 'vue';
import _ from 'lodash';

const state = {
  registrys: {},
};

const mutations = {
  init(s, registrys) {
    s.registrys = registrys;
  },
  delete(s, key) {
    Vue.delete(s.registrys, key);
  },
  add(s, registry) {
    s.registrys = _.assign({}, s.registrys, registry);
  },
};

const actions = {
  init({ commit }) {
    axios.get('/api/registrys').then((response) => {
      commit('init', response.data.message);
    });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
