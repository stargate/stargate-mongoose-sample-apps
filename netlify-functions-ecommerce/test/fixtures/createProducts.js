'use strict';

const { Product } = require('../../models');

module.exports = async function createProducts(params) {
  const products = await Product.insertMany(params.product);

  return { products };
};
