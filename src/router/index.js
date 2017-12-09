import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home';
import Registry from '@/components/registry';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/:name',
      component: Registry,
    },
  ],
});
