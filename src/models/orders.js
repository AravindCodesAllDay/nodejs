const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your user model is named "User"
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    paymentmethod: {
      type: String,
      required: true,
    },
    paymentDone: {
      type: String,
      default: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
