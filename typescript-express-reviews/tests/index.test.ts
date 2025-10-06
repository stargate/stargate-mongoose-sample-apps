import { after, before } from 'mocha';
import assert from 'assert';
import connect from '../src/models/connect';
import mongoose from '../src/models/mongoose';

before(async function() {
  this.timeout(120_000);

  await connect();

  assert.ok(mongoose.connection.keyspaceName);
  const { databases } = await mongoose.connection.listDatabases();
  if (!databases.find(db => db.name === mongoose.connection.keyspaceName)) {
    console.log('Creating keyspace', mongoose.connection.keyspaceName);
    await mongoose.connection.createKeyspace(mongoose.connection.keyspaceName as string);
  }
});

beforeEach(async function clearDb() {
  await Promise.all(Object.values(mongoose.models).map(Model => {
    return Model.deleteMany({});
  }));
});

after(async function() {
  await mongoose.disconnect();
});
