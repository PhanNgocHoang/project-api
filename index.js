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

cron.schedule("0 0,6,12,18,23 * * *", async () => {
  await changeOrderStatus();
  gridMail
    .send({
      to: {
        email: "hoangpn.dev@gmail.com",
      },
      templateId: "d-e4a7316604634d2cb081b67ede3f94ca",
      dynamicTemplateData: {
        displayName: new Date().toISOString(),
      },
      from: {
        email: "hoangpn.dev@gmail.com",
        name: "Admin",
      },
    })
    .then(() => {
      console.log("run cron");
    })
    .catch((err) => {
      console.log("run cron err");
    });
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
