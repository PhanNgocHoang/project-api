const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublisherSchema = new Schema(
  {
    publisherName: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
PublisherSchema.index({ "$**": "text" });
const Publishers = mongoose.model("publishers", PublisherSchema);
module.exports = Publishers;
