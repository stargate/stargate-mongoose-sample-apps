'use strict';

require('dotenv').config();
if (process.env.NODE_ENV === 'development') {
    console.log('using development');
    module.exports = require('./development');
} else {
    console.log('using production');
    module.exports = require('./production');
}