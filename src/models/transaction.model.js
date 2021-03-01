const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TransactionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  payeeEmail: { type: String, required: true },
});
const Transaction = mongoose.model("transaction", TransactionSchema);
module.exports = Transaction;
