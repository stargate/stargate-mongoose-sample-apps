'use strict';

const { describe, it } = require('mocha');
const assert = require('assert');
const { handler: addToCart } = require('../netlify/functions/addToCart');
const { handler: checkout } = require('../netlify/functions/checkout');
const fixtures = require('./fixtures');
const sinon = require('sinon');
const stripe = require('../integrations/stripe');

describe('Checkout', function() {
  this.timeout(10000);

  it('should do a successful checkout run', async function() {
    const products = await fixtures.createProducts({
      product: [
        { name: 'A Test Product', price: 500 },
        { name: 'Another Test Product', price: 600 }
      ]
    }).then((res) => res.products);
    const params = {
      body: {
        cartId: null,
        items: [
          { productId: products[0].id, quantity: 2 },
          { productId: products[1].id, quantity: 1 }
        ]
      }
    };
    params.body = JSON.stringify(params.body);
    const result = await addToCart(params);
    result.body = JSON.parse(result.body);
    assert(result.body);
    assert(result.body.items.length);

    params.body.cartId = result.body.id;
    sinon.stub(stripe.paymentIntents, 'retrieve').returns({ status: 'succeeded', id: '123', brand: 'visa', last4: '1234' });
    sinon.stub(stripe.paymentMethods, 'retrieve').returns({ status: 'succeeded', id: '123', brand: 'visa', last4: '1234' });
    sinon.stub(stripe.checkout.sessions, 'create').returns({
      status: 'succeeded',
      id: '123',
      brand: 'visa',
      last4: '1234',
      url: 'test-checkout-url'
    });
    
    params.body = JSON.stringify(params.body);

    const finish = await checkout(params);
    finish.body = JSON.parse(finish.body);
    assert(finish.body.cart);
    assert.equal(finish.body.cart.total, 1600);
    assert.equal(finish.body.url, 'test-checkout-url');
  });
});
