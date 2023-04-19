import assert from 'assert';
import mongoose from './mongoose';

const astraJSONAPIURL = process.env.ASTRA_JSON_API_URL ?? '';
const stargateJSONAPIURL = process.env.STARGATE_JSON_API_URL ?? '';
const username = process.env.STARGATE_JSON_USERNAME ?? '';
const password = process.env.STARGATE_JSON_PASSWORD ?? '';
const authUrl = process.env.STARGATE_JSON_AUTH_URL ?? '';
let options = {};
//astraJSONAPIURL takes precedence over stargateJSONAPIURL when both are set
let url = astraJSONAPIURL || stargateJSONAPIURL;
if (astraJSONAPIURL) {
  options = { createNamespaceOnConnect: false };
} else {
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
  options = { username, password, authUrl };
}

export default async function connect() {
  console.log('Connecting to', url);
  await mongoose.connect(url, options);
}


