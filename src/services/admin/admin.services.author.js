const Authors = require("../../models/authors.model");

module.exports.createAuthor = (authorInfo) => {
  const newAuthor = new Authors(authorInfo);
  return newAuthor.save();
};
module.exports.updateAuthor = (authorId, authorInfo) => {
  return Authors.updateOne({ _id: authorId }, authorInfo);
};
module.exports.deleteAuthor = (authorId) => {
  return Authors.deleteOne({ _id: authorId });
};
module.exports.getAuthors = async (page, perPage, searchKey) => {
  const totalItems = await Authors.countDocuments();
  const skip = (page - 1) * perPage;
  const authors = await Authors.find({
    authorName: { $regex: searchKey, $options: "mis" },
  })
    .skip(skip)
    .limit(perPage)
    .sort({ _id: -1 });
  return {
    data: authors,
    currentPage: page,
    totalItems: totalItems,
    perPage: perPage,
  };
};
module.exports.findAuthorByName = (authorName) => {
  return Authors.findOne({ authorName: authorName });
};
module.exports.findAuthorById = (authorId) => {
  return Authors.findOne({ _id: authorId });
};
module.exports.getAllAuthor = async () => {
  return await Authors.find({}, ["_id", "authorName"]);
};
module.exports.totalAuthor = async () => {
  const total = await Authors.countDocuments();
  return total;
};
