'use strict';

const config = require('@masteringjs/eslint-config');
const globals = require('globals');

module.exports = [
  {
    ignores: ['public/**']
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node
      }
    }
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        Vue: true,
        VueRouter: true
      }
    },
    files: ['frontend/**']
  },
  ...config
];
