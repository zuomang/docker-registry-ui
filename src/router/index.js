import Vue from 'vue';
import Router from 'vue-router';
import Default from '@/components/default';
import Repository from '@/components/repository';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Default,
    },
    {
      path: '/registry/:key',
      component: Repository,
    },
  ],
});
