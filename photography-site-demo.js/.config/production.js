'use strict';

module.exports = Object.freeze({
  jsonApiUrl: process.env.JSON_API_URL,
  jsonApiConnectOptions: {
    isAstra: true,
    createNamespaceOnConnect: false
  },
});

