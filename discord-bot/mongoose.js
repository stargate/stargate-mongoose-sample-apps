'use strict';

const mongoose = require('mongoose');

mongoose.set('autoCreate', process.env.MONGOOSE_AUTO_CREATE === 'false' ? false : true);
mongoose.set('autoIndex', false);

const { driver } = require('stargate-mongoose');
mongoose.setDriver(driver);

module.exports = mongoose;