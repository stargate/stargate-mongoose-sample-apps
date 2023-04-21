import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test'
});

import { after, before, beforeEach } from 'mocha';
import connect from '../src/models/connect';
import mongoose from '../src/models/mongoose';

before(async function() {
  await connect();
});

beforeEach(async function clearDb() {
  this.timeout(30_000);
  const models = Object.values(mongoose.models);
  await Promise.all(models.map(Model => Model.createCollection({})));
  await Promise.all(models.map(Model => Model.deleteMany({})));
});

after(async function() {
  await mongoose.disconnect();
});
