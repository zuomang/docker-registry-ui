import Vue from 'vue';
import Vuex from 'vuex';

import registry from './modules/registry';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        registry: registry
    }
});