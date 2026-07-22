import mongoose from 'mongoose';
import setupMongooseStudioUserModels from '../setupMongooseStudioUserPlugins';

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

import { driver } from '@datastax/astra-mongoose';

const configuredMongoose = mongoose.setDriver(driver);
setupMongooseStudioUserModels(configuredMongoose);

export default configuredMongoose;
