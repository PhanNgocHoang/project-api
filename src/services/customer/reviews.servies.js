const Reviews = require("../../models/review.model");

module.exports.create = async (reviewData) => {
  const newReview = new Reviews(reviewData);
  return await newReview.save();
};
module.exports.getReviewByBookId = async (bookId, page, limit) => {
  const reviews = await Reviews.find({ bookId: bookId })
    .populate({ path: "user" })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ _id: -1 });
  const totalItems = await Reviews.find({ bookId: bookId }).countDocuments();
  return { data: reviews, currentPage: page, totalItems: totalItems };
};
