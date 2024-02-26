'use strict';

require('dotenv').config({ path: `${__dirname}/../.env.test` });

const Bot = require('../models/bot');
const { after, before } = require('mocha');
const mongoose = require('../mongoose');

const uri = process.env.JSON_API_URL;
const jsonApiConnectOptions = {
  username: process.env.JSON_API_AUTH_USERNAME,
  password: process.env.JSON_API_AUTH_PASSWORD,
  authUrl: process.env.JSON_API_AUTH_URL
};

before(async function() {
  this.timeout(30000);
  await mongoose.connect(uri, jsonApiConnectOptions);
  // dropCollection() can be slower
  await Bot.db.dropCollection('bots').catch(() => {});
  await Bot.createCollection();
});

after(async function() {
  await mongoose.disconnect();
});