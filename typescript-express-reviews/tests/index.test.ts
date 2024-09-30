import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test'
});

import { after, before } from 'mocha';
import connect from '../src/models/connect';
import mongoose from 'mongoose';

import Authentication from '../src/models/authentication';
import Review from '../src/models/review';
import User from '../src/models/user';
import Vehicle from '../src/models/vehicle';

if (process.env.DATA_API_TABLES) {
  console.log('Testing Data API tables');
}

before(async function() {
  this.timeout(30000);

  await connect();

  if (process.env.DATA_API_TABLES) {
    // @ts-ignore
    await mongoose.connection.runCommand({
      dropTable: {
        name: 'authentications'
      }
    });
    // @ts-ignore
    await mongoose.connection.runCommand({
      dropTable: {
        name: 'reviews'
      }
    });
    // @ts-ignore
    await mongoose.connection.runCommand({
      dropTable: {
        name: 'users'
      }
    });
    // @ts-ignore
    await mongoose.connection.runCommand({
      dropTable: {
        name: 'vehicles'
      }
    });
    
    // @ts-ignore
    await mongoose.connection.runCommand({
      createTable: {
        name: 'authentications',
        definition: {
          primaryKey: '_id',
          columns: {
            _id: { type: 'text' },
            type: { type: 'text' },
            user_id: { type: 'text' },
            secret: { type: 'text' }
          }
        }
      }
    });
    // @ts-ignore
    await mongoose.connection.runCommand({
      createTable: {
        name: 'reviews',
        definition: {
          primaryKey: '_id',
          columns: {
            _id: { type: 'text' },
            rating: { type: 'int' },
            text: { type: 'text' },
            userId: { type: 'text' },
            vehicleId: { type: 'text' },
            createdAt: { type: 'decimal' },
            updatedAt: { type: 'decimal' }
          }
        }
      }
    });
    // @ts-ignore
    await mongoose.connection.runCommand({
      createTable: {
        name: 'users',
        definition: {
          primaryKey: '_id',
          columns: {
            _id: { type: 'text' },
            email: { type: 'text' },
            firstName: { type: 'text' },
            lastName: { type: 'text' }
          }
        }
      }
    });
    // @ts-ignore
    await mongoose.connection.runCommand({
      createTable: {
        name: 'vehicles',
        definition: {
          primaryKey: '_id',
          columns: {
            _id: { type: 'text' },
            make: { type: 'text' },
            model: { type: 'text' },
            year: { type: 'int' },
            images: { type: 'text' },
            numReviews: { type: 'int' },
            averageReview: { type: 'decimal' }
          }
        }
      }
    });
    // @ts-ignore
    await Review.collection.runCommand({
      addIndex: {
        column: 'vehicleId',
        indexName: 'vehicleId'
      }
    });
    // @ts-ignore
    await User.collection.runCommand({
      addIndex: {
        column: 'email',
        indexName: 'email'
      }
    });
    // @ts-ignore
    await Authentication.collection.runCommand({
      addIndex: {
        column: 'user_id',
        indexName: 'user_id'
      }
    });
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
