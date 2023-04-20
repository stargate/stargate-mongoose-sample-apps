'use strict';

const { after } = require('mocha');
const connect = require('../connect');
const mongoose = require('../mongoose');

before(async function() {
  this.timeout(30_000);
  await connect();

  await mongoose.connection.dropDatabase();
  await mongoose.connection.db.createDatabase();
  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.createCollection()));
});

after(async function() {
  await mongoose.disconnect();
});
