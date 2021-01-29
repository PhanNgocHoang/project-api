const Books = require("../../models/books.model");

module.exports.createBooks = async (bookData) => {
  try {
    const books = new Books(bookData);
    return books.save();
  } catch (error) {
    next(error);
  }
};
module.exports.updateBook = async (bookId, bookData) => {
  try {
    return Books.updateOne({ _id: bookId }, bookData);
  } catch (error) {
    next(error);
  }
};
module.exports.deleteBooks = (bookId) => {
  try {
    return Books.deleteOne({ _id: bookId });
  } catch (error) {
    next(error);
  }
};
module.exports.findBooksById = async (bookId) => {
  try {
    const books = await Books.findOne({ _id: bookId });
    return books;
  } catch (error) {
    next(error);
  }
};

module.exports.findBooksByName = async (bookName) => {
  try {
    return Books.findOne({ book_name: bookName });
  } catch (error) {
    next(error);
  }
};
module.exports.getBooks = async (page, perPage, searchKey) => {
  try {
    const totalItems = await Books.countDocuments();
    const skip = (page - 1) * perPage;
    const books = await Books.find({
      book_name: { $regex: searchKey, $options: "mis" },
    })
      .skip(skip)
      .limit(perPage);
    return { data: books, currentPage: page, totalItems: totalItems };
  } catch (error) {
    next(error);
  }
};
