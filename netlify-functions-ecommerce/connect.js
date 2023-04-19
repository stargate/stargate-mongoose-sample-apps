'use strict';

const config = require('./.config');
const mongoose = require('./mongoose');

require('./models');

let conn = null;

module.exports = async function connect() {
  if (conn != null) {
    return conn;
  }
  conn = mongoose.connection;

  const isAstra = config.astraJSONUri;

  const uri = isAstra ? config.astraJSONUri : config.stargateJSONUri;
  const options =
    isAstra ? {
      createNamespaceOnConnect: false
    } :
      {
        username: config.stargateJSONUsername,
        password: config.stargateJSONPassword,
        authUrl: config.stargateJSONAuthUrl
      };
  await mongoose.connect(uri, options);

  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.init()));
  return conn;
};
