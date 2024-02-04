const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    currentUserId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appointments", schema);
