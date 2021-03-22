const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    book_name: { type: String, required: true },
    authors: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "authors" },
    ],
    book_type: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "type_books",
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "publishers",
    },
    status: { type: Boolean, required: true, default: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    images: { type: String, required: true },
    file: { type: String, required: true },
    userFavorite: [
      { type: mongoose.Schema.Types.ObjectId, ref: "users", default: [] },
    ],
  },
  {
    timestamps: true,
  }
);
BookSchema.index({ "$**": "text" });
const Book = mongoose.model("books", BookSchema);
module.exports = Book;
