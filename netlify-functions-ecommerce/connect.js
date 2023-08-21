'use strict';

require('dotenv').config();

const config = require('./.config');
const mongoose = require('./mongoose');

require('./models');

let conn = null;

module.exports = async function connect() {
  if (conn != null) {
    return conn;
  }
  conn = mongoose.connection;

  let uri = config.jsonApiUrl;

  await mongoose.connect(uri, config.jsonApiConnectOptions);
  
  await Promise.all(Object.values(mongoose.connection.models).map(Model => Model.init()));
  return conn;
};
