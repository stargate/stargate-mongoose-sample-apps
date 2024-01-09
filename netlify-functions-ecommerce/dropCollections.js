'use strict';

require('dotenv').config();

const models = require('./models');
const connect = require('./connect');

dropCollections().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function dropCollections() {
  await connect();

  for (const Model of Object.values(models)) {
    console.log('Dropping', Model.collection.collectionName);
    await Model.db.dropCollection(Model.collection.collectionName);
  }

  console.log('Done');
  process.exit(0);
}
