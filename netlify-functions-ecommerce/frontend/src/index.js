'use strict';

const routes = require('./routes');

const app = Vue.createApp({
  setup() {
    const cartId = window.localStorage.getItem('__cartKey') || null;

    const state = Vue.reactive({
      status: 'loading',
      cartId,
      cart: null,
      products: []
    });

    Vue.provide('state', state);

    return state;
  },
  async mounted() {
    const products = await fetch('/.netlify/functions/getProducts').then(res => res.json());
    this.products = products;

    if (!this.cartId) {
      this.status = 'loaded';
      return;
    } 

    const cartId = encodeURIComponent(this.cartId);
    const { cart } = await fetch('/.netlify/functions/getCart?cartId=' + cartId).
      then(res => res.json());
    this.cart = cart;
    this.status = 'loaded';
  },
  template: '<app-component />'
});

app.component('app-component', {
  inject: ['state'],
  template: `
  <div>
    <navbar />
    <div class="view">
      <router-view v-if="state.status === 'loaded'" />
    </div>
  </div>
  `
});

require('./cart/cart')(app);
require('./home/home')(app);
require('./navbar/navbar')(app);
require('./order-confirmation/order-confirmation')(app);
require('./product/product')(app);
require('./products/products')(app);

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: routes.map(route => ({
    ...route,
    component: app.component(route.name),
    props: (route) => route.params
  }))
});

router.replace(window.location.pathname);

app.use(router);

app.mount('#content');