'use strict';

//'astraJSONUri' takes precedence over 'stargateJSONUri' when both are present, and the token is expected to be present as part of the 'astraJSONUri'
//'astraJSONUri' format : https://${ASTRA_DB_ID}-${ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/${ASTRA_KEYSPACE}?applicationToken=${ASTRA_DB_APPLICATION_TOKEN}
//For example: https://64c2aea9-0390-4ae0-bf5e-f41ad360d340-eu-west-1.apps.astra-test.datastax.com/api/json/v1/json_store?applicationToken=AstraCS:asdsadsadaSd:asdads

module.exports = Object.freeze({
  astraJSONUri: '',
  stargateJSONUri: 'http://127.0.0.1:8080/v1/ecommerce',
  stargateJSONUsername: 'cassandra',
  stargateJSONPassword: 'cassandra',
  stargateJSONAuthUrl: 'http://localhost:8081/v1/auth',
  stripeSecretKey: 'test',
  stripeSuccessUrl: 'http://localhost:8888/order-confirmation',
  stripeCancelUrl: 'http://localhost:8888/cart'
});

