'use strict';

const Bot = require('./models/bot');
const connect = require('./connect');
const mongoose = require('./mongoose');

seed().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function seed() {
  await connect();

  await mongoose.connection.createKeyspace(mongoose.connection.keyspaceName);
  await Bot.createCollection();
  await Bot.deleteMany({});

  console.log('Done');
  process.exit(0);
}
