'use strict';

const { after } = require('mocha');
const connect = require('../server/models/connect');
const mongoose = require('../server/models/mongoose');

before(async function() {
    this.timeout(30_000);
    await connect();

    await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.createCollection()));
    await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.deleteMany({})));
});

after(async function() {
    this.timeout(30_000);
    await Promise.all(Object.values(mongoose.connection.models).map(async Model => {
        await mongoose.connection.dropCollection(Model.collection.collectionName);
    }));

    await mongoose.disconnect();
});
