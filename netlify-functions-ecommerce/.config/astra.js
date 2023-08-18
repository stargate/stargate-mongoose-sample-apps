'use strict';

const {createAstraUri, AstraEnvironment} = require("stargate-mongoose");

module.exports = Object.freeze({
  jsonApiUrl: createAstraUri(process.env.ASTRA_DBID, process.env.ASTRA_REGION, process.env.ASTRA_KEYSPACE, process.env.ASTRA_APPLICATION_TOKEN, process.env.ASTRA_ENVIRONMENT ? process.env.ASTRA_ENVIRONMENT : AstraEnvironment.PRODUCTION),
  jsonApiConnectOptions: {
    isAstra: true
  },
  stripeSecretKey: 'test',
  stripeSuccessUrl: 'http://127.0.0.1:8888/order-confirmation',
  stripeCancelUrl: 'http://127.0.0.1:8888/cart'
});
