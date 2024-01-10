'use strict';

require('dotenv').config();

const { createAstraUri } = require('stargate-mongoose');
const mongoose = require('./mongoose');

require('./models/bot');

dropCollections().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function dropCollections() {
  let uri = '';
  let jsonApiConnectOptions = {};
  if (process.env.IS_ASTRA === 'true') {
    uri = createAstraUri(process.env.ASTRA_DBID, process.env.ASTRA_REGION, process.env.ASTRA_KEYSPACE, process.env.ASTRA_APPLICATION_TOKEN);
    jsonApiConnectOptions = {
      isAstra: true
    };
  } else {
    uri = process.env.JSON_API_URL;
    jsonApiConnectOptions = {
      username: process.env.JSON_API_AUTH_USERNAME,
      password: process.env.JSON_API_AUTH_PASSWORD,
      authUrl: process.env.JSON_API_AUTH_URL
    };
  }
  console.log('Connecting to', uri);
  await mongoose.connect(uri, jsonApiConnectOptions);

  for (const Model of Object.values(mongoose.models)) {
    console.log('Dropping', Model.collection.collectionName);
    await Model.db.dropCollection(Model.collection.collectionName).catch(err => {
      if (err?.errors?.[0]?.message === 'Request failed with status code 504') {
        return;
      }
      throw err;
    });
  }

  console.log('Done');
  process.exit(0);
}
