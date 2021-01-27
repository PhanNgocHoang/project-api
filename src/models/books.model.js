const mongoose = require('mongoose');
const Schema = mongoose.Schema

const BookSchema = new Schema({
    book_name: { type: String, required: true },
    author: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "authors" }],
    type_book: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "type_book" },
    publisher: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "publisher" },
    status: { type: Boolean, required: true, default: true },
    description: { type: String, required: true },
    images: { type: Array, required: true },
    file: { type: String, required: true }
})
BookSchema.index({ '$**': 'text' })
const Book = mongoose.model('books', BookSchema)
module.exports = Book