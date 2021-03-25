const routers = require("express").Router();
const { getDashboard } = require("../services/admin/dashboard.service");
const { authMiddleware, authAdmin } = require("../middlewares/auth");
routers.get("/", authMiddleware(true), authAdmin(), async (req, res) => {
  try {
    const dashboard = await getDashboard();
    return res.status(200).json(dashboard);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = routers;
