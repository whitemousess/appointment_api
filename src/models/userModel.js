const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    username: { type: String, require: true, unique: true },
    fullName: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    gender: { type: Number, require: true },
    phone: { type: String, require: true },
    imageUrl: { type: String, default: null },
    address: { type: String },
    specialist: { type: String },
    sicks: { type: Array },
    role: { type: Number, default: 2 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", schema);
