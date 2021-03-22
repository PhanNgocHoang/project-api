const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "books",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    price: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    totalDate: { type: Number, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
OrderSchema.index({ "$**": "text" });
const Order = mongoose.model("orders", OrderSchema);
module.exports = Order;
