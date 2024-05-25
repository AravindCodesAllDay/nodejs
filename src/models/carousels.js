const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema(
  {
    laptopPhotos: {
      type: Array,
      required: true,
    },
    mobilePhotos: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Carousel", carouselSchema);
