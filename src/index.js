import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App },
  router,
  created() {
    this.$store.dispatch('registry/init');
    this.$store.commit('breadcrumb/init');
  },
});
