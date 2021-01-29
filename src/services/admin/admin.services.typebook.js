const TypeBook = require("../../models/typeBook.model");
const Books = require("../../models/books.model");

module.exports.createTypeBook = (typeName) => {
  const newTypeBook = new TypeBook(typeName);
  return newTypeBook.save();
};
module.exports.typesBook = async (page, perPage, searchKey) => {
  const totalItems = await TypeBook.countDocuments();
  const skip = (page - 1) * perPage;
  const data = await TypeBook.find({
    type_name: { $regex: searchKey, $options: "mis" },
  })
    .skip(skip)
    .limit(perPage)
    .sort({ _id: -1 });
  return {
    data: data,
    currentPage: page,
    totalItems: totalItems,
    perPage: perPage,
  };
};
module.exports.getTypeBookDetail = (typeBookId) => {
  return TypeBook.findById(typeBookId);
};
module.exports.getBookTypebook = async (typeBookId, page, limit) => {
  const totalItems = await Books.countDocuments({ type_book: typeBookId });
  const skip = (page - 1) * perPage;
  const bookData = await Books.find({ type_book: typeBookId })
    .populate("author")
    .populate("publishers")
    .skip(skip)
    .limit(limit);
  return { data: bookData, currentPage: page, totalItems: totalItems };
};
module.exports.updateTypeBook = async (typeBookId, data) => {
  return TypeBook.updateOne({ _id: typeBookId }, data);
};
module.exports.deleteTypeBook = (typeBookId) => {
  return TypeBook.deleteOne({ _id: typeBookId });
};
module.exports.findTypeBookByTypeName = (typeName) => {
  return TypeBook.findOne({ type_name: typeName });
};
module.exports.getAllBookTypes = async () => {
  return await TypeBook.find({}, ["_id", "type_name"]);
};
