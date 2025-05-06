'use strict';

const mongoose = require('mongoose');

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);
mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });

const { driver } = require('@datastax/astra-mongoose');
mongoose.setDriver(driver);

module.exports = mongoose;
