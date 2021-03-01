const routers = require("express").Router();
const join = require("joi");
const {
  createBooks,
  updateBooks,
  deleteBooks,
  findBooksById,
  findBooksByName,
  getBooks,
  favoriteBook,
  myBookFavorite,
  findFavoriteBookById,
} = require("../services/admin/admin.services.books");

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
routers.delete("/:bookId", async (req, res, next) => {
  try {
    await deleteBooks(req.params.bookId);
    return res.status(200).json({ message: "Delete book successfully" });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: error.message });
  }
});

routers.get("/:bookId", async (req, res, next) => {
  try {
    const book = await findBooksById(req.params.bookId);
    return res.status(200).json({ data: book });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

routers.post("/createBook", async (req, res, next) => {
  try {
    const bookData = join.object({
      book_name: join
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
        .required(),
      authors: join.array().items(join.string()).required(),
      book_type: join.string().required(),
      publisher: join.string().required(),
      description: join.string().required(),
      images: join.object().required(),
      file: join.object().required(),
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
});

routers.put("/:bookId", async (req, res, next) => {
  try {
    const bookData = join.object({
      book_name: join
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9 ]*$"))
        .required(),
      authors: join.array().items(join.string()).required(),
      book_type: join.string().required(),
      publisher: join.string().required(),
      description: join.string().required(),
      images: join.object().required(),
      file: join.object().required(),
    });
    const newData = await bookData.validate(req.body);
    if (newData.error) {
      return res.status(400).json({ message: newData.error.message });
    }
    await updateBook(req.params.authorId, newData.value);
    return res.status(200).json({ message: "Update Book successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.put("/favorite", async (req, res) => {
  try {
    const favoriteResult = await favoriteBook(req.body.bookId, req.body.userId);
    return res.status(200).json({ result: favoriteResult });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
routers.get("/myBookFavorite/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await myBookFavorite(userId, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
// routers.get("/myBookFavoriteLocal", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const ids = req.body.ids || ["60223da18d27e23237640ba4"];
//     console.log(ids);

//     const books = await findFavoriteBookById(ids, page, limit);
//     return res.status(200).json(books);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error.message });
//   }
// });
module.exports = routers;
