import mongoose from './mongoose';

const stargateJSONAPIURL = process.env.STARGATE_JSON_API_URL ?? '';
const username = process.env.STARGATE_JSON_USERNAME ?? '';
const password = process.env.STARGATE_JSON_PASSWORD ?? '';
const authUrl = process.env.STARGATE_JSON_AUTH_URL ?? '';
if (!stargateJSONAPIURL) {
  throw new Error('Must set STARGATE_JSON_API_URL environment variable');
}
if (!username) {
  throw new Error('Must set STARGATE_JSON_USERNAME environment variable');
}
if (!password) {
  throw new Error('Must set STARGATE_JSON_PASSWORD environment variable');
}
if (!authUrl) {
  throw new Error('Must set STARGATE_JSON_AUTH_URL environment variable');
}

export default async function connect(autoCreate = true) {
  console.log('Connecting to', process.env.STARGATE_JSON_API_URL);
  await mongoose.connect(
    stargateJSONAPIURL,
    { username, password, authUrl, autoCreate } as mongoose.ConnectOptions
  );
}


