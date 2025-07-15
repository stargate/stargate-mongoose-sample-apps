'use strict';

require('dotenv').config();

const { Product } = require('../../models');
const connect = require('../../connect');

const handler = async(event) => {
  try {
    await connect();
    const products = await Product.find();
    return { statusCode: 200, body: JSON.stringify(products) };
  } catch (error) {
    return { statusCode: 500, body: error.stack };
  }
};

module.exports = { handler };
