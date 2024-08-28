'use strict';

const BaseComponent = require('../BaseComponent');

module.exports = app => app.component('cart', {
  inject: ['state'],
  data: () => ({
    submitting: false
  }),
  computed: {
    cartTotal() {
      return '$' + this.state.cart.items.reduce((sum, item) => {
        return sum + (+(item.quantity * this.product(item).price).toFixed(2));
      }, 0).toFixed(2);
    }
  },
  methods: {
    product(item) {
      const product = this.state.products.find(product => product._id === item.productId);
      return product;
    },
    formatTotal(item, product) {
      if (!product) {
        return '';
      }
      const total = (item.quantity * product.price).toFixed(2);
      return `$${total}`;
    },
    async checkout() {
      this.submitting = true;
      const res = await fetch('/.netlify/functions/checkout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartId: this.state.cartId
        })
      }).then(res => res.json());

      if (res.url) {
        window.location.href = res.url;
      }
      this.submitting = false;
    }
  },
  extends: BaseComponent(require('./cart.html'), require('./cart.css'))
});