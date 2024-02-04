const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    recentPostId: { type: Schema.Types.ObjectId, ref: "recentPost", required: true },
    currentUserId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("commentPost", schema);
