const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    imageUrl: { type: String },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("recentPost", schema);
