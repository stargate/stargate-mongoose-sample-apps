import { createAstraUri } from 'stargate-mongoose';
import mongoose from './mongoose';

const isAstra = process.env.IS_ASTRA ?? '';

const stargateJSONAPIURL = process.env.STARGATE_JSON_API_URL ?? '';
const username = process.env.STARGATE_JSON_USERNAME ?? '';
const password = process.env.STARGATE_JSON_PASSWORD ?? '';
const authUrl = process.env.STARGATE_JSON_AUTH_URL ?? '';

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
    await mongoose.connect(
      uri,
      { isAstra: true } as mongoose.ConnectOptions
    );
  } else {
    console.log('Connecting to', stargateJSONAPIURL);
    await mongoose.connect(
      stargateJSONAPIURL,
      { username, password, authUrl } as mongoose.ConnectOptions
    );
  }
}


