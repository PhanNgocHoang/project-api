const routers = require("express").Router();
const join = require("joi");
const {
  create,
  getReviewByBookId,
} = require("../services/customer/reviews.servies");
const { authMiddleware } = require("../middlewares/auth");
routers.post("/create", authMiddleware(true), async (req, res) => {
  try {
    const reviewData = join.object({
      user: join.string().required(),
      content: join.string().required(),
      bookId: join.string().required(),
    });
    const newData = await reviewData.validate(req.body);
    if (newData.error) {
      return res.status(400).json({ message: newData.error.message });
    }
    const review = await create(newData.value);
    return res.status(200).json({ review: review });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.get("/:bookId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const bookId = req.params.bookId;
    const result = await getReviewByBookId(bookId, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = routers;
