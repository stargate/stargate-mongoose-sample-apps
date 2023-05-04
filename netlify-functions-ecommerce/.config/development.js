'use strict';

module.exports = Object.freeze({
  jsonApiUrl: 'http://localhost:8080/v1/ecommerce_test',
  jsonApiConnectOptions: {
    username: 'cassandra',
    password: 'cassandra',
    authUrl: 'http://localhost:8081/v1/auth'
  },
  stripeSecretKey: 'test',
  stripeSuccessUrl: 'http://localhost:8888/order-confirmation',
  stripeCancelUrl: 'http://localhost:8888/cart'
});

