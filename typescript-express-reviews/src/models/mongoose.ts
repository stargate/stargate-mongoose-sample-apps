import mongoose from 'mongoose';

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

import { driver } from '@datastax/astra-mongoose';

export default mongoose.setDriver(driver);
