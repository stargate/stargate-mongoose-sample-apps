import { after, before } from 'mocha';
import assert from 'assert';
import connect from '../src/models/connect';
import mongoose from '../src/models/mongoose';

before(async function() {
  this.timeout(120_000);

  await connect();

  assert.ok(mongoose.connection.keyspaceName);
  await mongoose.connection.createKeyspace(mongoose.connection.keyspaceName);

  // Make sure all collections are created in Stargate
  await Promise.all(Object.values(mongoose.models).map(Model => {
    return Model.createCollection();
  }));
});

beforeEach(async function clearDb() {
  await Promise.all(Object.values(mongoose.models).map(Model => {
    return Model.deleteMany({});
  }));
});

after(async function() {
  await mongoose.disconnect();
});
