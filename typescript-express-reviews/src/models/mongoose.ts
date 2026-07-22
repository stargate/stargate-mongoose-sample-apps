import mongoose from 'mongoose';

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

import { driver } from '@datastax/astra-mongoose';

if (process.env.DATA_API_TABLES) {
  // Mongoose Studio relies on countDocuments, estimatedDocumentCount, and findOneAndUpdate.
  // for showing count results and updating documents. So hack around those
  // for tables.
  mongoose.plugin(schema => {
    schema.pre(['countDocuments', 'estimatedDocumentCount'], async function (this: any) {
      throw mongoose.skipMiddlewareFunction(
        await this.model
          .find(this.getFilter())
          .select({ _id: 1 })
          .then((res: any) => res.length)
      );
    });

    schema.pre('updateOne', async function () {
      if (!this.getUpdate()) {
        return;
      }
      // $setOnInsert not supported in table mode
      delete this.getUpdate().$setOnInsert;
    });

    schema.pre('findOneAndUpdate', async function () {
      throw mongoose.skipMiddlewareFunction(
        await this.model.updateOne(
          this.getFilter(),
          this.getUpdate() ?? {}
        ).then(() => this.model.findOne(this.getFilter()))
      );
    })
  });
}

export default mongoose.setDriver(driver);
