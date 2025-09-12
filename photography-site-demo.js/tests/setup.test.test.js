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
  const collections = await mongoose.connection.db.listCollections();
  for (const Model of Object.values(mongoose.models)) {
    const collectionName = Model.collection.collectionName;
    if (!collections.find(c => c.name === collectionName)) {
      await Model.createCollection();
      // Prime collections to avoid UnavailableException errors in CI
      console.log('Test insert for ', collectionName);
      let attempt = 0;
      let success = false;
      let lastError;
      while (attempt < 5 && !success) {
        try {
          await Model.collection.insertOne({});
          await Model.collection.deleteMany({});
          success = true;
        } catch (err) {
          if (!(err instanceof Error) || !err.message.includes('UnavailableException')) {
            throw err;
          }
          lastError = err;
          attempt++;
          const delay = Math.pow(2, attempt) * 100; // exponential backoff: 200ms, 400ms, 800ms, etc.
          await new Promise(res => setTimeout(res, delay));
        }
      }
      if (!success) {
        throw lastError;
      }
    }
  }
});

after(async function() {
  this.timeout(30000);
  await Promise.all(Object.values(mongoose.connection.models).map(async Model => {
    await mongoose.connection.dropCollection(Model.collection.collectionName);
  }));

  await mongoose.disconnect();
});
