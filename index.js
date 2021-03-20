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
const path = require("path");
const exphbs = require("express-handlebars");
const { changeOrderStatus } = require("./src/services/customer/order.services");
const PORT = process.env.PORT || 4000;

mongoose.connect(
  process.env.MONGO_URI,
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
});
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  return res.send("HELLO WORD");
});
app.set("view engine", ".hbs");
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "mainLayouts",
    layoutsDir: __dirname + "views/layouts",
    partialsDir: __dirname + "views/layouts",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger());
app.use(routers);
app.listen(PORT, () => {
  console.log("server listening on port " + PORT);
});
