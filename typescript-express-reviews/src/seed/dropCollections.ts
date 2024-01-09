import dotenv from 'dotenv';
dotenv.config();

import connect from '../models/connect';

import Authentication from '../models/authentication';
import Review from '../models/review';
import User from '../models/user';
import Vehicle from '../models/vehicle';

dropCollections().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function dropCollections() {
  await connect();

  for (const Model of [Authentication, Review, User, Vehicle]) {
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
