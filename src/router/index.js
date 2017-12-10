import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home';
import Registry from '@/components/registry';
import Repository from '@/components/repository';

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
    {
      path: '/:name/:repo',
      component: Repository,
    },
  ],
});
