'use strict';

const BaseComponent = require('../BaseComponent');

module.exports = app => app.component('products', {
  inject: ['state'],
  data: () => ({
    submitting: null
  }),
  methods: {
    formatPrice(price) {
      return `$${price.toFixed(2)}`;
    },
    async addToCart(product) {
      this.submitting = product;
      const body = {
        items: [{ productId: product.id, quantity: 1 }]
      };
      if (this.state.cart) {
        body.cartId = this.state.cart.id;
      }
      const res = await fetch('/.netlify/functions/addToCart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(res => res.json());
      this.state.cart = res;
      if (!this.state.cartId || this.state.cartId !== res.id) {
        this.state.cartId = res.id;
        window.localStorage.setItem('__cartKey', res.id);
      }
      this.submitting = null;
    }
  },
  extends: BaseComponent(require('./products.html'), require('./products.css'))
});