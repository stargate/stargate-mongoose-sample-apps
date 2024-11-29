'use strict';

require('../config');

const { after, before } = require('mocha');
const connect = require('../connect');
const mongoose = require('../mongoose');

if (process.env.DATA_API_TABLES) {
  console.log('Testing Data API tables');
}

before(async function() {
  this.timeout(30000);
  await connect();

  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.runCommand({
      dropTable: {
        name: 'products'
      }
    }).catch(err => {
      if (err.errors && err.errors.length === 1 && err.errors[0].errorCode === 'CANNOT_DROP_UNKNOWN_TABLE') {
        return;
      }
      throw err;
    });
    await mongoose.connection.runCommand({
      dropTable: {
        name: 'orders'
      }
    }).catch(err => {
      if (err.errors && err.errors.length === 1 && err.errors[0].errorCode === 'CANNOT_DROP_UNKNOWN_TABLE') {
        return;
      }
      throw err;
    });
    await mongoose.connection.runCommand({
      dropTable: {
        name: 'carts'
      }
    }).catch(err => {
      if (err.errors && err.errors.length === 1 && err.errors[0].errorCode === 'CANNOT_DROP_UNKNOWN_TABLE') {
        return;
      }
      throw err;
    });
    await mongoose.connection.runCommand({
      createTable: {
        name: 'products',
        definition: {
          primaryKey: '_id',
          columns: {
            _id: { type: 'text' },
            name: { type: 'text' },
            price: { type: 'decimal' },
            image: { type: 'text' },
            description: { type: 'text' }
          }
        }
      }
    });
    await mongoose.connection.runCommand({
      createTable: {
        name: 'orders',
        definition: {
          primaryKey: '_id',
          columns: {
            _id: { type: 'text' },
            total: { type: 'decimal' },
            name: { type: 'text' },
            paymentMethod: { type: 'map', keyType: 'text', valueType: 'text' },
            items: { type: 'list', valueType: 'text' }
          }
        }
      }
    });
    await mongoose.connection.runCommand({
      createTable: {
        name: 'carts',
        definition: {
          primaryKey: '_id',
          columns: {
            _id: { type: 'text' },
            items: { type: 'list', valueType: 'text' },
            orderId: { type: 'text' },
            total: { type: 'decimal' },
            stripeSessionId: { type: 'text' }
          }
        }
      }
    });
    await Promise.all(Object.values(mongoose.connection.models).map(Model => {
      return Model.find().then(docs => Promise.all(docs.map(doc => Model.deleteOne({ _id: doc._id }))));
    }));
  } else {
    await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.createCollection()));
    await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.deleteMany({})));
  }
});

after(async function() {
  await mongoose.disconnect();
});
