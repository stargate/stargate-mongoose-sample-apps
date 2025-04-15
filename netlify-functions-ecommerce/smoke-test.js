'use strict';

const assert = require('assert');

const baseUrl = 'http://127.0.0.1:8888/.netlify/functions';

void async function main() {
  const products = await fetch(`${baseUrl}/getProducts`)
    .then(res => res.json());

  assert.ok(Array.isArray(products));
  assert.ok(products.length > 0);

  let cart = await fetch(`${baseUrl}/addToCart`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{ productId: products[0]._id, quantity: 2 }]
    })
  }).then(res => res.json());

  assert.ok(cart);
  assert.equal(cart.items.length, 1);
  assert.deepStrictEqual(cart.items, [{
    productId: products[0]._id.toString(), quantity: 2
  }]);

  cart = await fetch(`${baseUrl}/addToCart`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cartId: cart._id,
      items: [{ productId: products[0]._id, quantity: 1 }]
    })
  }).then(res => res.json());

  assert.ok(cart);
  assert.equal(cart.items.length, 1);
  assert.deepStrictEqual(cart.items, [{
    productId: products[0]._id.toString(), quantity: 3
  }]);

  console.log('Successfully created cart', cart);
}();
