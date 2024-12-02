'use strict';

require('dotenv').config();

const Bot = require('./models/bot');
const connect = require('./connect');
const mongoose = require('./mongoose');

seed().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function seed() {
  await connect();

  if (!process.env.IS_ASTRA) {
    await mongoose.connection.createNamespace(mongoose.connection.db.name);
  }
  
  const existingCollections = await mongoose.connection.listCollections()
    .then(collections => collections.map(c => c.name));
  if (!existingCollections.includes(Bot.collection.collectionName)) {
    await Bot.createCollection();
  }

  console.log('Done');
  process.exit(0);
}
