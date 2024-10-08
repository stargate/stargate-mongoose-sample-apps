'use strict';

const { createAstraUri } = require('stargate-mongoose');
const mongoose = require('./mongoose');

module.exports = async function connect() {
  let uri = '';
  let jsonApiConnectOptions = {};
  if (process.env.IS_ASTRA === 'true') {
    uri = createAstraUri(
      process.env.ASTRA_API_ENDPOINT,
      process.env.ASTRA_APPLICATION_TOKEN,
      process.env.ASTRA_NAMESPACE
    );
    jsonApiConnectOptions = {
      isAstra: true
    };
  } else {
    uri = process.env.DATA_API_URI;
    jsonApiConnectOptions = {
      username: process.env.DATA_API_AUTH_USERNAME,
      password: process.env.DATA_API_AUTH_PASSWORD,
      authUrl: process.env.DATA_API_AUTH_URL
    };
  }
  console.log('Connecting to', uri);
  await mongoose.connect(uri, jsonApiConnectOptions);
};