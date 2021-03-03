const routers = require("express").Router();
const {
  createOrder,
  getOrderByUser,
} = require("../services/customer/order.services");
const { findUserById, updateWallet } = require("../services/users");
const join = require("joi");
routers.post("/create", async (req, res) => {
  try {
    const orderData = join.object({
      userId: join.string().required("User is required"),
      bookId: join.string().required("Book is required"),
      totalDate: join.number().min(1).required("Total date is required"),
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
      return res.status(404).json({ message: "User do not exist" });
    }
    const userWallet = user.wallet - newData.value.price;
    if (userWallet < 0) {
      return res
        .status(404)
        .json({ message: "Your eCoins are not enough to borrow this book" });
    }
    await updateWallet(newData.value.userId, userWallet);
    await createOrder(newData.value);
    return res.status(200).json({ message: "Borrow successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = routers;
