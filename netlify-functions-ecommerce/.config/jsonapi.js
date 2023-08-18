'use strict';

module.exports = Object.freeze({
  jsonApiUrl: process.env.JSON_API_URL,
  jsonApiConnectOptions: {
    username: process.env.JSON_API_AUTH_USERNAME,
    password: process.env.JSON_API_AUTH_PASSWORD,
    authUrl: process.env.JSON_API_AUTH_URL
  },
  stripeSecretKey: 'test',
  stripeSuccessUrl: 'http://localhost:8888/order-confirmation',
  stripeCancelUrl: 'http://localhost:8888/cart'
});