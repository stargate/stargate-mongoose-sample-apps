import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test'
});

import { after, before, beforeEach } from 'mocha';
import connect from '../src/models/connect';
import mongoose from '../src/models/mongoose';

before(async function() {
  this.timeout(10000);

  await connect(false);

  await mongoose.connection.dropDatabase();
  await mongoose.connection.db.createDatabase();
  // Make sure all collections are created in Stargate, because Stargate
  // doesn't auto create collections.
  await Promise.all(Object.values(mongoose.models).map(Model => {
    return Model.createCollection();
  }));
});

beforeEach(async function clearDb() {
  this.timeout(30000);

  await Promise.all(Object.values(mongoose.models).map(Model => Model.deleteMany({})));
});

after(async function() {
  this.timeout(30_000);
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
