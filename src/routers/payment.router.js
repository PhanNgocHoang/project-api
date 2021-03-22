const routers = require("express").Router();
const { checkPayment } = require("../services/customer/payment.services");
const {
  create,
  getTransaction,
} = require("../services/customer/transaction.services");
const { updateWallet } = require("../services/users");

routers.post("/updateWallet", async (req, res) => {
  try {
    const paymentInfo = await checkPayment(req.body.paymentId);
    if (paymentInfo === null) {
      return res.status(400).json({ message: "Payment do not exist" });
    }
    const transactionData = {
      userId: req.body.userId,
      paymentId: req.body.paymentId,
      amount: parseFloat(paymentInfo.amount.total),
      currency: paymentInfo.amount.currency,
      payeeEmail: paymentInfo.payee.email,
    };
    await create(transactionData);
    const newWallet = await updateWallet(
      req.body.userId,
      parseFloat(paymentInfo.amount.total) * 10
    );
    return res
      .status(200)
      .json({ message: "Add coins successfully", userWallet: newWallet });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.get("/history", async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const transactions = await getTransaction(user._id, limit, page);
    return res.status(200).json(transactions);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message });
  }
});
module.exports = routers;
