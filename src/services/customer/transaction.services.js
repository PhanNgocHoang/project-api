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
module.exports.totalTransaction = async () => {
  const totalTransaction = await Transaction.countDocuments();
  const totalMoney = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);
  return {
    totalTransaction: totalTransaction,
    totalMoney: totalMoney[0].total,
  };
};
module.exports.getAllTransaction = async (limit, page, searchKey) => {
  const transactions = await Transaction.find()
    .populate({
      path: "userId",
      match: { email: { $regex: searchKey, $options: "mis" } },
    })
    .limit(limit)
    .page(limit * (page - 1))
    .sort({ _id: -1 });
  const totalItems = await Transaction.find()
    .populate({
      path: "userId",
      match: { email: { $regex: searchKey, $options: "mis" } },
    })
    .countDocuments();
  return { data: transactions, currentPage: page, totalItems: totalItems };
};
