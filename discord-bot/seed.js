'use strict';

const Bot = require('./models/bot');
const connect = require('./connect');
const mongoose = require('./mongoose');
const { tableDefinitionFromSchema } = require('@datastax/astra-mongoose');

seed().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function seed() {
  await connect();

  await mongoose.connection.createKeyspace(mongoose.connection.keyspaceName);
  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.createTable(
      Bot.collection.collectionName,
      tableDefinitionFromSchema(Bot.schema)
    );
  } else {
    await Bot.createCollection();
  }

  await Bot.deleteMany({});

  console.log('Done');
  process.exit(0);
}
