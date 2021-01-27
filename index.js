const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const routers = require("./src/routers/index");
const mongoose = require("mongoose");
const passport = require("passport");

const PORT = process.env.PORT || 4000;

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
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger());
app.use(routers);
app.listen(PORT, () => {
  console.log("server listening on port " + PORT);
});
