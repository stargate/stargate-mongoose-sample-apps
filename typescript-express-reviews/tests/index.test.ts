import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test'
});

import { after, before } from 'mocha';
import connect from '../src/models/connect';
import mongoose from 'mongoose';

before(async function() {
  this.timeout(60000);

  await connect();

  if (!process.env.IS_ASTRA) {
    // @ts-ignore
    await mongoose.connection.createNamespace(mongoose.connection.db.name);
  }

  // Make sure all collections are created in Stargate, _after_ calling
  // `connect()`. stargate-mongoose doesn't currently support buffering on
  // connection helpers.
  await Promise.all(Object.values(mongoose.models).map(Model => {
    return Model.createCollection();
  }));
});

// `deleteMany()` currently does nothing
/*beforeEach(async function clearDb() {
  this.timeout(30000);

  await Promise.all(Object.values(mongoose.models).map(Model => {
    return Model.deleteMany({});
  }));
});*/

after(async function() {
  await mongoose.disconnect();
});
