import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test'
});

import { after, before } from 'mocha';
import connect from '../src/models/connect';
import mongoose from 'mongoose';
import { driver, tableDefinitionFromSchema } from 'stargate-mongoose';

import Authentication from '../src/models/authentication';
import Review from '../src/models/review';
import User from '../src/models/user';
import Vehicle from '../src/models/vehicle';

if (process.env.DATA_API_TABLES) {
  console.log('Testing Data API tables');
}

before(async function() {
  this.timeout(60000);

  await connect();

  const connection: driver.Connection = mongoose.connection as unknown as driver.Connection;
  if (!process.env.IS_ASTRA) {
    await connection.createNamespace(connection.namespace as string);
  }

  if (process.env.DATA_API_TABLES) {
    await connection.dropTable('authentications');
    await connection.dropTable('reviews');
    await connection.dropTable('users');
    await connection.dropTable('vehicles');

    await connection.createTable('authentications', tableDefinitionFromSchema(Authentication.schema));
    await connection.createTable('reviews', tableDefinitionFromSchema(Review.schema));
    await connection.createTable('users', tableDefinitionFromSchema(User.schema));
    await connection.createTable('vehicles', tableDefinitionFromSchema(Vehicle.schema));
  } else {
    // Make sure all collections are created in Stargate, _after_ calling
    // `connect()`. stargate-mongoose doesn't currently support buffering on
    // connection helpers.
    await Promise.all(Object.values(mongoose.models).map(Model => {
      return Model.createCollection();
    }));
  }
});

// `deleteMany()` currently does nothing
beforeEach(async function clearDb() {
  this.timeout(30000);

  if (process.env.DATA_API_TABLES) {
    await Promise.all(Object.values(mongoose.connection.models).map(Model => {
      return Model.find().then(docs => Promise.all(docs.map(doc => Model.deleteOne({ _id: doc._id }))));
    }));
  } else {
    await Promise.all(Object.values(mongoose.models).map(Model => {
      return Model.deleteMany({});
    }));
  }
});

after(async function() {
  await mongoose.disconnect();
});
