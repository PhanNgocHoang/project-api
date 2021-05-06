const routers = require("express").Router();
const {
  createOrder,
  getAllOrders,
  expiredOrder,
} = require("../services/customer/order.services");
const { findUserById, updateWallet } = require("../services/users");
const { authAdmin } = require("../middlewares/auth");
const join = require("joi");
routers.post("/create", async (req, res) => {
  try {
    const orderData = join.object({
      userId: join.string().required("User is required"),
      bookId: join.string().required("Book is required"),
      totalDate: join.number().required("Total date is required"),
      startedAt: join.date().required(),
      endAt: join.date().required(),
      price: join.number().required(),
    }); 
    const newData = await orderData.validate(req.body);
    if (newData.error) {
      return res.status(400).json({ message: newData.error.message });
    }
    const user = await findUserById(newData.value.userId);
    if (user == null) {
      return res.status(400).json({ message: "User do not exist" });
    }
    const userWallet = user.wallet - newData.value.price;
    if (userWallet < 0) {
      return res
        .status(400)
        .json({ message: "Your eCoins are not enough to borrow this book" });
    }
    await updateWallet(newData.value.userId, userWallet);
    const order = await createOrder(newData.value);
    return res
      .status(200)
      .json({ message: "Borrow successfully", order: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.get("/", authAdmin(), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchKey = req.query.searchKey || "";
    const result = await getAllOrders(page, limit, searchKey);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.post("/expiredOrder", authAdmin(), async (req, res) => {
  try {
    const order = await expiredOrder(req.body.orderId);
    if (order === false) {
      return res
        .status(400)
        .json({ message: "The book loan period has not yet expired." });
    }
    return res.status(200).json({ message: order });
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = routers;
