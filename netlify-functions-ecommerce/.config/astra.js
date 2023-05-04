'use strict';

module.exports = Object.freeze({
  jsonApiUrl: 'https://xyz.apps.astra.datastax.com/api/json/v1/my-keyspace?applicationToken=AstraCS:my-application-token',
  jsonApiConnectOptions: {
    isAstra: true
  },
  stripeSecretKey: 'test',
  stripeSuccessUrl: 'http://localhost:8888/order-confirmation',
  stripeCancelUrl: 'http://localhost:8888/cart'
});

