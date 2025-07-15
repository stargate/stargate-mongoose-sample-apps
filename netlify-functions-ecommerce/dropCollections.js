'use strict';

const connect = require('./connect');
const mongoose = require('./mongoose');

dropCollections().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function dropCollections() {
  await connect();

  const collections = await mongoose.connection.listCollections();
  for (const collection of collections) {
    console.log('Dropping', collection.name);
    await mongoose.connection.dropCollection(collection.name);
  }

  console.log('Done');
  process.exit(0);
}
