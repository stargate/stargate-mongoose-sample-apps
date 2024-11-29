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
  } else {
    const collections = await mongoose.connection.listCollections();
    for (const collection of collections) {
      console.log('Dropping', collection.name);
      await mongoose.connection.dropCollection(collection.name);
    }
  }

  console.log('Done');
  process.exit(0);
}
