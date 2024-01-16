'use strict';

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: `${__dirname}/.env.test` });
} else {
  require('dotenv').config();
}