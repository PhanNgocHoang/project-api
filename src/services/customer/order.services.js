const Order = require("../../models/order.model");

module.exports.createOrder = async (orderInfo) => {
  const newOrder = new Order(orderInfo);
  return newOrder.save();
};
module.exports.getOrderByUser = async (userId, page, limit) => {
  const query = Order.find({ userId: userId });

  const orders = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ _id: -1 });
  const totalItems = await query.countDocuments();
  return {
    data: orders,
    currentPage: page,
    totalItems: totalItems,
    perPage: limit,
  };
};
module.exports.changeOrderStatus = async () => {
  await Order.updateMany(
    { endAt: { $lte: new Date().toISOString() } },
    { status: false }
  );
};
