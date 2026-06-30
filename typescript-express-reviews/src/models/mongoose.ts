import mongoose from 'mongoose';

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

import { driver } from '@datastax/astra-mongoose';

if (process.env.DATA_API_TABLES) {
  // Mongoose Studio relies on countDocuments and estimatedDocumentCount, so need
  // to add those to show count results.
  mongoose.plugin(schema => {
    schema.pre(['countDocuments', 'estimatedDocumentCount'], async function (this: any) {
      throw mongoose.skipMiddlewareFunction(
        await this.model.find().select({ _id: 1 }).then((res: any) => res.length)
      );
    });
  });
}

export default mongoose.setDriver(driver);
