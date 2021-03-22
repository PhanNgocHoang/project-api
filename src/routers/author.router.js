const routers = require("express").Router();
const join = require("joi");
const {
  getAuthors,
  updateAuthor,
  createAuthor,
  deleteAuthor,
  findAuthorById,
  findAuthorByName,
  getAllAuthor,
} = require("../services/admin/admin.services.author");
const { authMiddleware, authAdmin } = require("../middlewares/auth");
routers.get("/getAll", async (req, res, next) => {
  try {
    const authors = await getAllAuthor();
    return res.status(200).json({ data: authors });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});

routers.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchKey = req.query.searchKey || "";
    const result = await getAuthors(page, limit, searchKey);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

routers.delete(
  "/:authId",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      await deleteAuthor(req.params.authId);
      return res.status(200).json({ message: "Delete author successfully" });
    } catch (error) {
      next(error);
      return res.status(500).json({ message: error.message });
    }
  }
);

routers.get(
  "/:authorId",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      const author = await findAuthorById(req.params.authorId);
      return res.status(200).json({ data: author });
    } catch (error) {
      next(error);
      return res.status(error.statusCode).json({ message: error.message });
    }
  }
);

routers.post(
  "/createAuthor",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      const authorData = join.object({
        authorName: join
          .string()
          .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
          .required(),
        dob: join.date().required(),
      });
      const newData = await authorData.validate(req.body);
      if (newData.error) {
        return next(createError(400, newData.error.message));
      }
      const author = await findAuthorByName(req.body.authorName);
      if (author) {
        return next(createError(400, "Author is exist"));
      }
      await createAuthor(newData.value);
      return res.status(200).json({ message: "Author created successfully" });
    } catch (error) {
      next(error);
      return res.status(500).json({ message: error.message });
    }
  }
);

routers.put(
  "/:authorId",
  authMiddleware(true),
  authAdmin(),
  async (req, res, next) => {
    try {
      const authorData = join.object({
        authorName: join
          .string()
          .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
          .required(),
        dob: join.date().required(),
      });
      const newData = await authorData.validate({
        authorName: req.body.authorName,
        dob: req.body.dob,
      });
      if (newData.error) {
        return next(createError(400, newData.error.message));
      }
      await updateAuthor(req.params.authorId, newData.value);
      return res.status(200).json({ message: "Update Author successfully" });
    } catch (error) {
      next(error);
      return res.status(500).json({ message: error.message });
    }
  }
);

module.exports = routers;
