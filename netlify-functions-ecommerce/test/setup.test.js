'use strict';

require('../config');

const { after, before } = require('mocha');
const connect = require('../connect');
const mongoose = require('../mongoose');

before(async function() {
  this.timeout(60000);
  await connect();

  if (!process.env.IS_ASTRA) {
    await mongoose.connection.createNamespace(mongoose.connection.namespace);
  }

  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.createCollection()));
  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.deleteMany({})));
});

after(async function() {
  await mongoose.disconnect();
});
