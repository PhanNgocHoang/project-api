const Reviews = require("../../models/review.model");

module.exports.create = async (reviewData) => {
  const newReview = new Reviews(reviewData);
  const review = await newReview.save();
  return await Reviews.findOne({ _id: review._id }).populate({ path: "user" });
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
