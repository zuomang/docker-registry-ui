import axios from 'axios';
import Vue from 'vue';
import _ from 'lodash';

const state = {
    registrys: {}
}

const mutations = {
    init(state, registrys) {
        state.registrys = registrys;
    },
    delete(state, key) {
        Vue.delete(state.registrys, key);
    },
    add(state, registry) {
        state.registrys = _.assign({}, state.registrys, registry);
    }
}

const actions = {
    init({ commit, state }) {
        axios.get('/api/registrys').then((response) => {
            commit('init', response.data.message);
        }).catch((err) => {
            console.log(err.response.data.message);
        })
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}