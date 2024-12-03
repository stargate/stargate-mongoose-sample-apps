'use strict';

require('dotenv').config({ path: `${__dirname}/../.env.test` });

const Bot = require('../models/bot');
const { after, before } = require('mocha');
const mongoose = require('../mongoose');

const uri = process.env.DATA_API_URI;
const jsonApiConnectOptions = {
  username: process.env.DATA_API_AUTH_USERNAME,
  password: process.env.DATA_API_AUTH_PASSWORD,
  authUrl: process.env.DATA_API_AUTH_URL
};

before(async function() {
  this.timeout(30000);
  await mongoose.connect(uri, jsonApiConnectOptions);

  if (!process.env.IS_ASTRA) {
    await mongoose.connection.createNamespace(mongoose.connection.namespace);
  }

  // dropCollection() can be slower
  await Bot.db.dropCollection('bots').catch(() => {});
  await Bot.createCollection();
});

after(async function() {
  await mongoose.disconnect();
});
