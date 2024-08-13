'use strict';

const { Order } = require('../../models');

module.exports = async function createOrder(params) {

  const [order] = await Order.insertMany(params.order);
  return { order };
};
