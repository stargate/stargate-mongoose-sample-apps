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

  await Promise.all(Object.values(mongoose.models).map(Model => {
    return Model.createCollection();
  }));

  // Try to insert a placeholder authentication document up to 5 times with exponential stepback
  // This is to avoid UnavailableException in CI
  const Authentication = mongoose.models.Authentication;
  const placeholder = {
    type: 'password',
    userId: new mongoose.Types.ObjectId(),
    secret: 'placeholder_secret'
  };
  let attempt = 0;
  while (attempt < 5) {
    try {
      await Authentication.create(placeholder);
      break;
    } catch (err) {
      if (!(err instanceof Error) || !err.message.includes('UnavailableException')) {
        throw err;
      }
      attempt++;
      if (attempt < 5) {
        await new Promise(res => setTimeout(res, 2 ** attempt * 100));
      }
    }
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
