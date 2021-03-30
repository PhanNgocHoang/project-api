const Order = require("../../models/order.model");
const User = require("../../models/users.model");
const moment = require("moment");

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
    {
      endAt: { $lte: moment().toISOString() },
    },
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
  }).populate({
    path: "bookId",
    select: ["file", "fileType", "book_name", "images", "authors"],
    populate: {
      path: "authors",
      select: "authorName",
    },
  });
  return order;
};
module.exports.getAllOrders = async (page, limit, searchKey) => {
  const users = await User.find({
    email: { $regex: searchKey, $options: "mis" },
  }).select("_id");
  const userId = users.map((user) => user._id);
  const order = await Order.find({ userId: { $in: userId } })
    .populate({ path: "userId" })
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ _id: -1 });
  const totalItems = await Order.find({
    userId: { $in: userId },
  }).countDocuments();
  return { orders: order, totalItems: totalItems, currentPage: page };
};
module.exports.totalOrder = async () => {
  const total = await Order.countDocuments();
  return total;
};
module.exports.totalTime = async () => {
  const sum = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalDate" },
      },
    },
  ]);
  return sum[0].total;
};
module.exports.totalPrice = async () => {
  const sum = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$price" },
      },
    },
  ]);
  return sum[0].total;
};
