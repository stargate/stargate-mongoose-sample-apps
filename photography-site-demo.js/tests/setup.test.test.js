'use strict';

require('dotenv').config({ path: `${__dirname}/../.env.test` });

const Photo = require('../server/models/Photo');
const Category = require('../server/models/Category');
const PhotoEmbedding = require('../server/models/PhotoEmbedding');

const { before } = require('mocha');
const mongoose = require('../server/models/mongoose');

const uri = process.env.JSON_API_URL;
const jsonApiConnectOptions = {
  username: process.env.JSON_API_AUTH_USERNAME,
  password: process.env.JSON_API_AUTH_PASSWORD,
  authUrl: process.env.JSON_API_AUTH_URL
};

before(async function() {
  console.log('Connecting to', uri);
  this.timeout(30000);
  await mongoose.connect(uri, jsonApiConnectOptions);
  await Photo.db.dropCollection('photos').catch(() => {});
  await Category.db.dropCollection('categorys').catch(() => {});
  await PhotoEmbedding.db.dropCollection('photoEmbeddings').catch(() => {});
  await Photo.createCollection();
  await Category.createCollection();
  await PhotoEmbedding.createCollection();

});


