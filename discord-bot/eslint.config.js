'use strict';

const config = require('@masteringjs/eslint-config');
const globals = require('globals');

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node
      }
    }
  },
  ...config
];
