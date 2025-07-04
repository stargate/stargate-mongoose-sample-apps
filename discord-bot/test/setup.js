'use strict';

const Bot = require('../models/bot');
const { after, before } = require('mocha');
const mongoose = require('../mongoose');

const uri = process.env.DATA_API_URI;
const jsonApiConnectOptions = {
  username: process.env.DATA_API_AUTH_USERNAME,
  password: process.env.DATA_API_AUTH_PASSWORD,
  isAstra: false
};

before(async function() {
  this.timeout(120000);
  await mongoose.connect(uri, jsonApiConnectOptions);
  await mongoose.connection.createKeyspace(mongoose.connection.keyspaceName);
  // dropCollection() can be slower
  await Bot.db.dropCollection('bots').catch(() => {});
  await Bot.createCollection();
});

after(async function() {
  await mongoose.disconnect();
});
