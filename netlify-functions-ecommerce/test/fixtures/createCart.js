'use strict';

const { Cart } = require('../../models');

module.exports = async function createCart(params) {
  const [cart] = await Cart.insertMany({ items: params.items });
  return { cart };
};
