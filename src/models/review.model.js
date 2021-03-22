const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReviewSchema = new Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "books",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Reviews = mongoose.model("reviews", ReviewSchema);
module.exports = Reviews;
