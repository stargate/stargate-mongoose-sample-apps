'use strict';

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
  {
    rules: {
      // Errors: probable bugs
      semi: 'error',
      'no-throw-literal': 'error',
      'quote-props': ['error', 'as-needed'],
      'no-dupe-keys': 'error',
      'no-const-assign': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',

      // Warnings: style and readability concerns
      indent: [
        'warn',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 2
        }
      ],
      quotes: ['warn', 'single'],
      'comma-dangle': ['warn', 'never'],
      'object-curly-spacing': ['warn', 'always'],
      'prefer-const': 'warn',
      'no-extra-semi': 'warn',
      'comma-spacing': ['warn', { before: false, after: true }],
      'comma-style': 'warn',
      'keyword-spacing': 'warn',
      'no-whitespace-before-property': 'warn',
      'no-multi-spaces': 'warn',
      'func-call-spacing': 'warn',
      'key-spacing': [
        'warn',
        {
          beforeColon: false,
          afterColon: true
        }
      ],
      'space-before-blocks': 'warn',
      'space-before-function-paren': ['warn', 'never'],
      'space-infix-ops': 'warn',
      'space-unary-ops': 'error',
      'no-var': 'warn'
    }
  }
];
