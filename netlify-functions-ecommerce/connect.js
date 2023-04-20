'use strict';

const config = require('./.config');
const mongoose = require('./mongoose');

require('./models');

let conn = null;

module.exports = async function connect(autoCreate = true) {
  if (conn != null) {
    return conn;
  }
  conn = mongoose.connection;

  let uri = config.stargateJSONUri;

  await mongoose.connect(uri, {
    username: config.stargateJSONUsername,
    password: config.stargateJSONPassword,
    authUrl: config.stargateJSONAuthUrl,
    autoCreate
  });
  
  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.init()));
  return conn;
};
