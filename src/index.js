import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from 'vue';
import App from './app';
// import router from './router';
// import filters from './filters';

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    // router: router
})