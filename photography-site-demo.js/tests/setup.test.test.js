'use strict';

require('dotenv').config({ path: `${__dirname}/../.env.test` });

const { before, after } = require('mocha');
const connect = require('../server/models/connect');
const mongoose = require('../server/models/mongoose');

before(async function() {
  this.timeout(120000);
  await connect();
  const { databases } = await mongoose.connection.listDatabases();
  if (!databases.find(db => db.name === mongoose.connection.keyspaceName)) {
    await mongoose.connection.createKeyspace(mongoose.connection.keyspaceName);
  }
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
