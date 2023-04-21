'use strict';

const { after } = require('mocha');
const connect = require('../connect');
const mongoose = require('../mongoose');

before(async function() {
  this.timeout(30_000);
  await connect();

  await mongoose.connection.dropDatabase();

  const models = Object.values(mongoose.connection.models);
  await Promise.all(models.map(Model => Model.createCollection()));
});

after(async function() {
  await mongoose.disconnect();
});
