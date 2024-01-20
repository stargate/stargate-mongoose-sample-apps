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
  
  const existingCollections = await mongoose.connection.listCollections();
  if (!existingCollections.includes(Bot.collection.collectionName)) {
    await Bot.createCollection();
  }

  console.log('Done');
  process.exit(0);
}
