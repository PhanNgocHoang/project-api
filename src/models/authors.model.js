const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AuthorsSchema = new Schema(
  {
    authorName: { type: String, required: true },
    dob: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);
AuthorsSchema.index({ "$**": "text" });
const Authors = mongoose.model("authors", AuthorsSchema);
module.exports = Authors;
