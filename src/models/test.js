const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  photo: {
    type: String,
  },
  moreImg: {
    type: Array,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  categories: {
    type: Array,
  },
  stock: {
    type: Boolean,
    default: true,
  },
  offerPrice: {
    type: Number,
  },
});

module.exports = mongoose.model("Test", productSchema);
