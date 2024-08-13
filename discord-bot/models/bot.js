'use strict';

const mongoose = require('../mongoose');

const botSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId()
  },
  name: String,
  deleted: {
    type: Number,
    default: 0
  }
}, { _id: false, versionKey: false });

const Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;