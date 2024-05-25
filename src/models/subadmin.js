const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subadminSchema = new Schema(
  {
    mail: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regular expression to validate email format
    },
    pswd: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubAdmin", subadminSchema);
