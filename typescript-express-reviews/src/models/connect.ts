import { createAstraUri } from '@datastax/astra-mongoose';
import mongoose from './mongoose';

const isAstra = process.env.IS_ASTRA ?? '';

const dataAPIURI = process.env.DATA_API_URI ?? '';
const username = process.env.DATA_API_AUTH_USERNAME ?? '';
const password = process.env.DATA_API_AUTH_PASSWORD ?? '';

const astraAPIEndpoint = process.env.ASTRA_API_ENDPOINT ?? '';
const astraNamespace = process.env.ASTRA_NAMESPACE ?? '';
const astraApplicationToken = process.env.ASTRA_APPLICATION_TOKEN ?? '';

export default async function connect() {
  if (isAstra) {
    const uri = createAstraUri(
      astraAPIEndpoint,
      astraApplicationToken,
      astraNamespace
    );
    console.log('Connecting to', uri);
    await mongoose.connect(uri, {
      isTable: !!process.env.DATA_API_TABLES
    });
  } else {
    console.log('Connecting to', dataAPIURI);
    await mongoose.connect(
      dataAPIURI,
      {
        username,
        password,
        isAstra: false,
        isTable: !!process.env.DATA_API_TABLES
      }
    );
  }
}
