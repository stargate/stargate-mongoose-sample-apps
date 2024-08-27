'use strict';

const { Cart } = require('../../models');

module.exports = async function createCart(params) {
  const cart = await Cart.create({ items: params.items });
  return { cart };
};
