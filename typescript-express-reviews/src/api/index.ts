import { addAsync } from '@awaitjs/express';
import express from 'express';
import register from './User/register';
import login from './User/login';
import create from './Review/create';
import findById from './Vehicle/findById';
import findByVehicle from './Review/findByVehicle';
import bodyParser from 'body-parser';
import connect from '../models/connect';
import studio from '@mongoosejs/studio';
import mongoose from '../models/mongoose';
import mongooseStudioSetup from '../mongooseStudioSetup';

const port = process.env.PORT || 3000;

const googleGeminiAPIKey = process.env.GEMINI_API_KEY;

void async function main() {
  const app = addAsync(express());

  // Pretty JSON responses because this app doesn't have a frontend yet
  app.set('json spaces', 2);

  await connect();

  app.use(bodyParser.json());
  const opts = googleGeminiAPIKey ? { googleGeminiAPIKey } : {};

  const studioConnection = mongoose.connection.useDb(mongoose.connection.keyspaceName as string, { isTable: true });
  app.use(
    '/studio',
    await studio.express(
      // @ts-ignore
      null,
      mongoose.connection,
      {
        changeStream: false,
        studioConnection,
        ...opts
      }
    )
  );
  await mongooseStudioSetup(studioConnection);
  app.get('/status', function (req: express.Request, res: express.Response) {
    res.json({ ok: 1 });
  });

  //console.log(await mongoose.model('Authentication').estimatedDocumentCount())

  app.putAsync('/register', register);
  app.putAsync('/login', login);
  app.postAsync('/review/create', create);
  app.getAsync('/vehicle/find-by-id', findById);
  app.getAsync('/review/find-by-vehicle', findByVehicle);

  await app.listen(port);
  console.log('Listening on port ' + port);
}();
