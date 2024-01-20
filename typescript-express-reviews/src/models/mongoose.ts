import mongoose from 'mongoose';

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

import { driver } from 'stargate-mongoose';
mongoose.setDriver(driver);

export default mongoose;