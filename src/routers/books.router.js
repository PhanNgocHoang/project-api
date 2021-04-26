const routers = require("express").Router();
const join = require("joi");
const {
  createBooks,
  updateBook,
  deleteBooks,
  findBooksById,
  findBooksByName,
  getBooks,
  favoriteBook,
  myBookFavorite,
} = require("../services/admin/admin.services.books");
const {
  getOrderByUser,
  getMyBook,
  getBookByOrderId,
} = require("../services/customer/order.services");
const { authMiddleware, authAdmin } = require("../middlewares/auth");
routers.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchKey = req.query.searchKey || "";
    const publisher = req.query.publisher || [];
    const bookType = req.query.bookType || [];
    const authors = req.query.authors || [];
    const result = await getBooks(
      page,
      limit,
      searchKey,
      publisher,
      bookType,
      authors
    );
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.delete(
  "/:bookId",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      await deleteBooks(req.params.bookId);
      return res.status(200).json({ message: "Delete book successfully" });
    } catch (error) {
      next(error);
      return res.status(500).json({ message: error.message });
    }
  }
);

routers.get("/:bookId", async (req, res) => {
  try {
    const book = await findBooksById(req.params.bookId);
    return res.status(200).json({ data: book });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

routers.post(
  "/createBook",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      const bookData = join.object({
        book_name: join.string().required(),
        authors: join.array().items(join.string()).required(),
        book_type: join.string().required(),
        publisher: join.string().required(),
        description: join.string().required(),
        images: join.string().required(),
        file: join.string().required(),
        price: join.number().required(),
        fileType: join.string().required(),
      });
      const newData = await bookData.validate(req.body);
      if (newData.error) {
        return res.status(400).json({ message: newData.error.message });
      }
      const author = await findBooksByName(req.body.book_name);
      if (author) {
        return res.status(400).json({ message: "Books name is exist" });
      }
      await createBooks(newData.value);
      return res.status(200).json({ message: "Book created successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

routers.put(
  "/:bookId",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      const bookData = join.object({
        book_name: join.string().required(),
        authors: join.array().items(join.string()).required(),
        fileType: join.string().required(),
        book_type: join.string().required(),
        publisher: join.string().required(),
        description: join.string().required(),
        images: join.string().required(),
        file: join.string().required(),
        price: join.number().required(),
      });
      const newData = await bookData.validate(req.body);
      if (newData.error) {
        return res.status(400).json({ message: newData.error.message });
      }
      await updateBook(req.params.bookId, newData.value);
      return res.status(200).json({ message: "Update Book successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);
routers.post("/favorite", authMiddleware(true), async (req, res) => {
  try {
    const favoriteResult = await favoriteBook(req.body.bookId, req.body.userId);
    return res.status(200).json({ result: favoriteResult });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.get(
  "/myBookFavorite/:userId",
  authMiddleware(true),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const result = await myBookFavorite(userId, page, limit);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);
routers.get("/myBook/:userId", authMiddleware(true), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;
    const userId = req.params.userId;
    const books = await getOrderByUser(userId, page, limit);
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.get(
  "/myBook/status/:userId",
  authMiddleware(true),
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const page = parseInt(req.query.page) || 1;
      const status = req.query.status || true;
      const userId = req.params.userId;
      const books = await getMyBook(userId, page, limit, status);
      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);
routers.get(
  "/read/:userId/:orderId",
  authMiddleware(true),
  async (req, res) => {
    try {
      const order = await getBookByOrderId(
        req.params.orderId,
        req.params.userId
      );
      if (order) {
        const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const orderTime = moment(order.endAt).format("YYYY-MM-DD HH:mm:ss");
        if (moment(orderTime).isBefore(currentTime)) {
          return res.status(400).json({ message: "Borrow has been expired" });
        } else {
          return res.status(200).json({ data: order });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Can't find your loan history for this book" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);
module.exports = routers;
