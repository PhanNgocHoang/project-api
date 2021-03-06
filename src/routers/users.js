const routers = require("express").Router();
const { getUsers, blockUser, unBlockUser } = require("../services/users");
const { authMiddleware, authAdmin } = require("../middlewares/auth");
routers.get("/", authMiddleware(true), authAdmin(), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchKey = req.query.searchKey || "";
    const users = await getUsers(page, limit, searchKey);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.post("/block", authMiddleware(true), authAdmin(), async (req, res) => {
  try {
    await blockUser(req.body.userId);
    return res.status(200).json({ message: "Block user successfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message });
  }
});
routers.post(
  "/unBlock",
  authMiddleware(true),
  authAdmin(),
  async (req, res) => {
    try {
      await unBlockUser(req.body.userId);
      return res.status(200).json({ message: "User has been unBlock" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);
module.exports = routers;
