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
    .sort({ _id: -1 })
    .populate({
      path: "bookId",
      select: ["book_name", "images", "description", "userFavorite"],
    });
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
module.exports.getMyBook = async (userId, page, limit, status) => {
  const query = Order.find({ userId: userId, status: status });
  const orders = await query
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ _id: -1 })
    .populate({
      path: "bookId",
      select: ["book_name", "images", "description", "userFavorite"],
    });
  const totalItems = await query.countDocuments();
  return {
    data: orders,
    currentPage: page,
    totalItems: totalItems,
    perPage: limit,
  };
};
module.exports.getBookByOrderId = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    userId: userId,
    status: true,
  }).populate({ path: "bookId", select: "file" });
  return order;
};
