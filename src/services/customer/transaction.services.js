const Transaction = require("../../models/transaction.model");

module.exports.create = async (data) => {
  const newTransaction = new Transaction(data);
  return await newTransaction.save();
};
