'use strict';

module.exports = require('stripe')(process.env.STRIPE_SECRET_KEY);
