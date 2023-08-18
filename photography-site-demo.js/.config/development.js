'use strict';

module.exports = Object.freeze({
  jsonApiUrl: process.env.JSON_API_URL,
  jsonApiConnectOptions: {
    username: 'cassandra',
    password: 'cassandra',
    authUrl: process.env.AUTH_URL
  },

});

