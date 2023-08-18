'use strict';

const assert = require('assert');
const axios = require('axios');

const baseUrl = 'http://127.0.0.1:8888/.netlify/functions';

void async function main() {
  const products = await axios.get(`${baseUrl}/getProducts`).then(res => res.data);

  assert.ok(Array.isArray(products));
  assert.ok(products.length > 0);

  let cart = await axios.
    put(
      `${baseUrl}/addToCart`, {
        items: [{ productId: products[0]._id, quantity: 2 }]
      }
    ).
    then(res => res.data);
  assert.ok(cart);
  assert.equal(cart.items.length, 1);
  assert.deepStrictEqual(cart.items, [{
    productId: products[0]._id.toString(), quantity: 2
  }]);

  cart = await axios.
    put(
      `${baseUrl}/addToCart`, {
        cartId: cart._id,
        items: [{ productId: products[0]._id, quantity: 1 }]
      }
    ).
    then(res => res.data);
  assert.ok(cart);
  assert.equal(cart.items.length, 1);
  assert.deepStrictEqual(cart.items, [{
    productId: products[0]._id.toString(), quantity: 3
  }]);

  console.log('Successfully created cart', cart);
}();
