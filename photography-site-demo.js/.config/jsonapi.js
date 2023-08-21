'use strict';

module.exports = Object.freeze({
    jsonApiUrl: process.env.JSON_API_URL,
    jsonApiConnectOptions: {
        username: 'cassandra',
        password: 'cassandra',
        authUrl: process.env.JSON_API_AUTH_URL
    },

});

