import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from 'vue';
import App from './app';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    store,
    template: '<App/>',
    components: { App },
    router: router,
    created: function() {
        this.$store.dispatch('registry/init');
    }
})