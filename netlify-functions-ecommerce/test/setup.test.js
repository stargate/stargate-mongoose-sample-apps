'use strict';

const { after, before } = require('mocha');
const connect = require('../connect');
const mongoose = require('../mongoose');

before(async function() {
  this.timeout(120000);
  await connect();
  const { databases } = await mongoose.connection.listDatabases();
  if (!databases.find(db => db.name === mongoose.connection.keyspaceName)) {
    console.log('Creating keyspace', mongoose.connection.keyspaceName);
    await mongoose.connection.createKeyspace(mongoose.connection.keyspaceName);
  }

  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.createCollection()));
  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.deleteMany({})));
});

after(async function() {
  await mongoose.disconnect();
});
