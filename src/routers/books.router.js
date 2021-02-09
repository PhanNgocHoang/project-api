const routers = require("express").Router();
const join = require("joi");
const {
  createBooks,
  updateBooks,
  deleteBooks,
  findBooksById,
  findBooksByName,
  getBooks,
} = require("../services/admin/admin.services.books");

routers.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const searchKey = req.query.searchKey || "";
    const result = await getBooks(page, limit, searchKey);
    return res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});
routers.delete("/:bookId", async (req, res, next) => {
  try {
    await deleteBooks(req.params.authId);
    return res.status(200).json({ message: "Delete book successfully" });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});

routers.get("/:bookId", async (req, res, next) => {
  try {
    const author = await findBooksById(req.params.authorId);
    return res.status(200).json({ data: author });
  } catch (error) {
    next(error);
    return res.status(error.statusCode).json({ message: error.message });
  }
});

routers.post("/createBook", async (req, res, next) => {
  try {
    const bookData = join.object({
      book_name: join
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
        .required(),
      author: join.string().required(),
      book_type: join.string().required(),
      publisher: join.string().required(),
      destination: join.string().required(),
      images: join.array().required(),
      file: join.string().required(),
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
    next(error);
    return res.status(500).json({ message: error.message });
  }
});

routers.put("/:bookId", async (req, res, next) => {
  try {
    const bookData = join.object({
      book_name: join
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
        .required(),
      author: join.string().required(),
      book_type: join.string().required(),
      publisher: join.string().required(),
      destination: join.string().required(),
      images: join.array().required(),
      file: join.string().required(),
    });
    const newData = await bookData.validate(req.body);
    if (newData.error) {
      return res.status(400).json({ message: newData.error.message });
    }
    await updateBook(req.params.authorId, newData.value);
    return res.status(200).json({ message: "Update Book successfully" });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = routers;
