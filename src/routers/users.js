const routers = require("express").Router();
const { getUsers } = require("../services/users");

routers.get("/", async (req, res) => {
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
module.exports = routers;
