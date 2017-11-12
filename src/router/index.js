import Vue from 'vue';
import Router from 'vue-router';
import Default from '@/components/default';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        { path: '/', component: Default }
    ]
});