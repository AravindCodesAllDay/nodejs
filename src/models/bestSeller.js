const mongoose = require('mongoose');

const bestsellerSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    // required: true
  }
});

module.exports = mongoose.model('Bestseller', bestsellerSchema);