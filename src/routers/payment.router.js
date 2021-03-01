const routers = require("express").Router();
const { checkPayment } = require("../services/customer/payment.services");
const { create } = require("../services/customer/transaction.services");
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
    await updateWallet(
      req.body.userId,
      parseFloat(paymentInfo.amount.total) * 10
    );
    return res.status(200).json({ message: "Add coins successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = routers;
