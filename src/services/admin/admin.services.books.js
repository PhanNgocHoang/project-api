const Books = require("../../models/books.model");

module.exports.createBooks = async (bookData) => {
  try {
    const books = new Books(bookData);
    return books.save();
  } catch (error) {
    throw new Error(error);
  }
};
module.exports.updateBook = async (bookId, bookData) => {
  try {
    return Books.updateOne({ _id: bookId }, bookData);
  } catch (error) {
    throw new Error(error);
  }
};
module.exports.deleteBooks = (bookId) => {
  try {
    return Books.deleteOne({ _id: bookId });
  } catch (error) {
    throw new Error(error);
  }
};
module.exports.findBooksById = async (bookId) => {
  try {
    const books = await Books.findOne({ _id: bookId })
      .populate({ path: "authors", select: "authorName" })
      .populate({ path: "publisher", select: "publisherName" })
      .populate({ path: " book_type", select: "type_name" });
    return books;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.findBooksByName = async (bookName) => {
  try {
    return Books.findOne({ book_name: bookName });
  } catch (error) {
    throw new Error(error);
  }
};
module.exports.getBooks = async (
  page,
  perPage,
  searchKey,
  publisher,
  bookType,
  author
) => {
  try {
    const skip = (page - 1) * perPage;
    const query = Books.find({
      $and: [
        {
          book_name: { $regex: searchKey, $options: "mis" },
        },
      ],
    });
    if (publisher.length > 0) {
      query.find({ publisher: { $in: publisher } });
    }
    if (bookType.length > 0) {
      query.find({ book_type: { $in: bookType } });
    }
    if (author.length > 0) {
      query.find({ authors: { $in: author } });
    }
    const books = await query
      .skip(skip)
      .sort({ _id: -1 })
      .limit(perPage)
      .populate({ path: "authors", select: "authorName" })
      .populate({ path: "publisher", select: "publisherName" })
      .populate({ path: " book_type", select: "type_name" });
    const totalItems = await query.countDocuments();
    return { data: books, currentPage: page, totalItems: totalItems };
  } catch (error) {
    throw new Error(error);
  }
};
module.exports.getNewBook = async () => {
  const newBook = await Books.find();
  return newBook;
};
module.exports.favoriteBook = async (bookId, userId) => {
  const book = await Books.findOne({ _id: bookId });
  const user = book.userFavorite.find((user) => (user = userId));
  if (user) {
    await Books.updateOne(
      { _id: bookId },
      { $pull: { userFavorite: { $in: [userId] } } }
    );
    return "Favorite Successfully";
  } else {
    await Books.updateOne({ _id: bookId }, { $push: { userFavorite: userId } });
    return "Unfavorite Successfully";
  }
};
module.exports.myBookFavorite = async (userId, page, limit) => {
  const books = await Books.find({ myBookFavorite: { $in: [userId] } })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ _id: -1 })
    .populate({ path: "authors", select: "authorName" })
    .populate({ path: "publisher", select: "publisherName" })
    .populate({ path: " book_type", select: "type_name" });
  const totalItems = await Books.find({
    myBookFavorite: { $in: [userId] },
  }).countDocuments();
  return { data: books, currentPage: page, totalItems: totalItems };
};
