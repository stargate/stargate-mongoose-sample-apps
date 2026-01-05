'use strict';

import mongoose from 'mongoose';

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

import { driver } from '@datastax/astra-mongoose';
mongoose.setDriver(driver);

mongoose.connect(process.env.DATA_API_URL, {
  isAstra: process.env.IS_ASTRA === 'true',
  username: process.env.DATA_API_AUTH_USERNAME,
  password: process.env.DATA_API_AUTH_PASSWORD
});

export default mongoose;
