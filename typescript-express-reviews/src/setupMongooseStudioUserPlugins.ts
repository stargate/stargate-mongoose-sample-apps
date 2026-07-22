import type { AstraMongoose } from '@datastax/astra-mongoose';

export default function setupMongooseStudioUserPlugins(mongoose: AstraMongoose) {
  if (!process.env.DATA_API_TABLES) {
    return;
  }

  // Mongoose Studio relies on countDocuments, estimatedDocumentCount, and findOneAndUpdate
  // for showing count results and updating documents. So hack around those for tables.
  mongoose.plugin(schema => {
    schema.pre(['countDocuments', 'estimatedDocumentCount'], async function (this: any) {
      throw mongoose.skipMiddlewareFunction(
        await this.model
          .find(this.getFilter())
          .select({ _id: 1 })
          .lean()
          .then((res: any) => res.length)
      );
    });

    schema.pre('updateOne', async function () {
      const update = this.getUpdate();
      if (!update || Array.isArray(update) || !update.$setOnInsert) {
        return;
      }
      // $setOnInsert not supported in table mode
      delete update.$setOnInsert;
      this.setUpdate(update);
    });

    schema.pre('findOneAndUpdate', async function () {
      throw mongoose.skipMiddlewareFunction(
        await this.model.updateOne(
          this.getFilter(),
          this.getUpdate() ?? {}
        ).then(() => this.model.findOne(this.getFilter()))
      );
    });
  });
}
