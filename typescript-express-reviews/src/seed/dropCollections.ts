import dotenv from 'dotenv';
dotenv.config();

import connect from '../models/connect';
import mongoose from '../models/mongoose';

dropCollections().catch(err => {
  console.error(err);
  process.exit(-1);
});

async function dropCollections() {
  await connect();

  const collections = await mongoose.connection.listCollections() as unknown as string[];
  for (const collection of collections) {
    console.log('Dropping', collection);
    await mongoose.connection.dropCollection(collection);
  }

  console.log('Done');
  process.exit(0);
}
