'use strict';

if (process.env.NODE_ENV) {
  console.log('Using ' + process.env.NODE_ENV + ' profile');
  module.exports = require('./' + process.env.NODE_ENV);
} else {
  console.log('Using jsonapi profile' + process.env.NODE_ENV);
  module.exports = require('./jsonapi');
}