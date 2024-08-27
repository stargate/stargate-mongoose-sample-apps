'use strict';

const { describe, it } = require('mocha');
const assert = require('assert');
const { handler: getCart } = require('../netlify/functions/getCart');
const fixtures = require('./fixtures');

describe('Get the cart given an id', function() {
  it('Should create a cart and then find the cart.', async function() {
    const { cart } = await fixtures.createCart({});

    const params = {
      queryStringParameters: {
        cartId: cart._id
      }
    };
    const findCart = await getCart(params);
    assert.equal(findCart.statusCode, 200);
    findCart.body = JSON.parse(findCart.body);
    assert.equal(findCart.body.cart._id, cart._id.toString());
  });
});
