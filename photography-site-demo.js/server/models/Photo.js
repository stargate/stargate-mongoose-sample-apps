'use strict';
const mongoose = require('./mongoose')

const options = {
  "collectionOptions": {
    "vector": {
      "size": 1536, //embedding array size for openAI embedding api, text->vector
      "function": "cosine",
    }
  }
};

const photoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
  category: {
    type: String,
    enum: ['landscape', 'street', 'animal'],
    required: 'This field is required.'
  },
  $vector: {
    type: [Number],
    validate: v => v == null || v.length === 1536
  }
}, options);



module.exports = mongoose.model('photo', photoSchema);