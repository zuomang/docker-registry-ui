import Vue from 'vue';
import Vuex from 'vuex';

import registry from './modules/registry';
import breadcrumb from './modules/breadcrumb';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    registry,
    breadcrumb,
  },
});
