const User = require("../models/users.model");
const { verifyToken } = require("../services/users");
const authMiddleware = (required) => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      if (required) {
        res.status(401).send("Token not found");
      } else {
        next();
      }
    }
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decideObj = verifyToken(token);
      const id = decideObj.id;
      User.findOne({ _id: id })
        .exec()
        .then((user) => {
          req.user = user._doc;
          next();
        })
        .catch(() => {
          res.status(401).send("User not found");
        });
    } catch {
      if (required) {
        res.status(401).send("Invalid token");
      } else {
        next();
      }
    }
  };
};
module.exports = { authMiddleware };
