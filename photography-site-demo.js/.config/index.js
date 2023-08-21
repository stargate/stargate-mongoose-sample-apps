'use strict';

require('dotenv').config();
if (process.env.NODE_ENV) {
    if (process.env.NODE_ENV === 'astra') {
        console.log('running photography demo against astra');
        module.exports = require('./astra');
    } else {
        console.log('running photography demo against local jsonapi');
        module.exports = require('./jsonapi');
    }
}