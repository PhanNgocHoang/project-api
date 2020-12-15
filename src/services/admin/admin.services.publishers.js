const Publishers = require('../../models/publishers.model')

module.exports.createPublisher = (publisherInfo) => {
    const newPublisher = new Publishers(publisherInfo)
    return newPublisher.save()
}
module.exports.updatePublisher = (publisherID ,publisherInfo) => {
    return Publishers.updateOne({_id: publisherID}, publisherInfo)
}
module.exports.deletePublisher = (publisherID) => {
    return Publishers.deleteOne({_id: publisherID})
}
module.exports.getDetailsPublisher = (publisherID)=>{
    return Publishers.findOne({_id: publisherID})
}
module.exports.getPublishers = async (page)=>{
    const totalPages = await Publishers.countDocuments()
    const perPage = 5
    const skip = (page - 1) * perPage
    const publishers = await Publishers.find().skip(skip).limit(perPage)
    return {data: publishers, currentPage: page, totalPages: totalPages}
}