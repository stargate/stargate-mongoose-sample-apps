'use strict';

const mongoose = require('mongoose');

mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

const { driver } = require('@datastax/astra-mongoose');
mongoose.setDriver(driver);

module.exports = mongoose;
