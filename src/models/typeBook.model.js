const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeBookSchema = new Schema(
  {
    type_name: { type: String, require: true, unique: true },
  },
  {
    timestamps: true,
  }
);
typeBookSchema.index({ "$**": "text" });
const typeBook = mongoose.model("book_type", typeBookSchema);
module.exports = typeBook;
