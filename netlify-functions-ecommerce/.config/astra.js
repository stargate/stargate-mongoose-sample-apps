'use strict';

module.exports = Object.freeze({
  jsonApiUrl: `https://$\{ASTRA_DB_ID\}-$\{ASTRA_DB_REGION\}.apps.$\{ASTRA_DB_ENVIRONMENT\}.datastax.com/$\{ASTRA_DB_BASE_API_PATH\}/$\{ASTRA_DB_KEYSPACE\}?applicationToken=$\{AUTH_TOKEN\}`,
  jsonApiConnectOptions: {
    isAstra: true
  },
  stripeSecretKey: 'test',
  stripeSuccessUrl: 'http://localhost:8888/order-confirmation',
  stripeCancelUrl: 'http://localhost:8888/cart'
});
