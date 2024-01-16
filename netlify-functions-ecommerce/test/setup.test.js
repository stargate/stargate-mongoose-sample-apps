'use strict';

require('../config');

const { after, before } = require('mocha');
const connect = require('../connect');
const mongoose = require('../mongoose');

before(async function() {
  this.timeout(30000);
  await connect();

  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.createCollection()));
  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.deleteMany({})));
});

after(async function() {
  this.timeout(30000);
  await Promise.all(Object.values(mongoose.connection.models).map(async Model => {
    await mongoose.connection.dropCollection(Model.collection.collectionName);
  }));

  await mongoose.disconnect();
});
