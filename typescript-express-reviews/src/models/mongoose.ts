import mongoose from 'mongoose';

mongoose.set('autoIndex', false);

import { driver } from 'stargate-mongoose';
mongoose.setDriver(driver);

export default mongoose;