const Publishers = require("../../models/publishers.model");

module.exports.createPublisher = (publisherInfo) => {
  const newPublisher = new Publishers(publisherInfo);
  return newPublisher.save();
};
module.exports.updatePublisher = (publisherID, publisherInfo) => {
  return Publishers.updateOne({ _id: publisherID }, publisherInfo);
};
module.exports.deletePublisher = (publisherID) => {
  return Publishers.deleteOne({ _id: publisherID });
};
module.exports.getDetailsPublisher = (publisherID) => {
  return Publishers.findOne({ _id: publisherID });
};
module.exports.getPublishers = async (page, perPage, searchKey) => {
  const totalItems = await Publishers.countDocuments();
  const skip = (page - 1) * perPage;
  const publishers = await Publishers.find({
    publisherName: { $regex: searchKey, $options: "mis" },
  })
    .skip(skip)
    .limit(perPage)
    .sort({ _id: -1 });
  return {
    data: publishers,
    currentPage: page,
    totalItems: totalItems,
    perPage: perPage,
  };
};
module.exports.findPublisherByName = async (name) => {
  return Publishers.findOne({ publisherName: name });
};
module.exports.getAllPublishers = () => {
  return Publishers.find({}, ["_id", "publisherName"]);
};
module.exports.totalPublishers = async () => {
  return await Publishers.countDocuments();
};
