import mongoose from 'mongoose';

mongoose.set('autoCreate', process.env.MONGOOSE_AUTO_CREATE === 'false' ? false : true);
mongoose.set('autoIndex', false);

import { driver } from 'stargate-mongoose';
mongoose.setDriver(driver);

export default mongoose;