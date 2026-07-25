import mongoose from 'mongoose';
import { setupMongooseStudioTablesPlugin } from '@mongoosejs/mongoose-studio-data-api-plugin';

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

import { driver } from '@datastax/astra-mongoose';

const configuredMongoose = mongoose.setDriver(driver);
if (process.env.DATA_API_TABLES) {
  setupMongooseStudioTablesPlugin(configuredMongoose);
}

export default configuredMongoose;
