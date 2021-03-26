require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const routers = require("./src/routers/index");
const mongoose = require("mongoose");
const passport = require("passport");
const cron = require("node-cron");
const gridMail = require("@sendgrid/mail");
const { changeOrderStatus } = require("./src/services/customer/order.services");
const PORT = process.env.PORT || 4000;
gridMail.setApiKey(process.env.MAIL_KEY);

mongoose.connect(
  "mongodb+srv://admin:Admin123@@cluster0.9m6f6.mongodb.net/eLibrary?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Connection database successfully");
  }
);

cron.schedule("0 0 * * *", async () => {
  await changeOrderStatus();
});
cron.schedule("0 6 * * *", async () => {
  await changeOrderStatus();
});
cron.schedule("0 12 * * *", async () => {
  await changeOrderStatus();
});
cron.schedule("0 18 * * *", async () => {
  await changeOrderStatus();
});
cron.schedule("0 23 * * *", async () => {
  await changeOrderStatus();
});
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  return res.send("HELLO WORD");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger());
app.use(routers);
app.listen(PORT, () => {
  console.log("server listening on port " + PORT);
});
