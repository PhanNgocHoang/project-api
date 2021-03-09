const Transaction = require("../../models/transaction.model");

module.exports.create = async (data) => {
  const newTransaction = new Transaction(data);
  return await newTransaction.save();
};
module.exports.getTransaction = async (userId, limit, page) => {
  const query = Transaction.find({ userId: userId });
  const transactions = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ _id: -1 });
  const totalItems = await query.countDocuments();
  return {
    data: transactions,
    totalItems: totalItems,
    perPage: limit,
    page: page,
  };
};
