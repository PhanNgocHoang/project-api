const TypeBook = require('../../models/typeBook.model')
const Books = require('../../models/books.model')


module.exports.createTypeBook = (typeName)=>{
    const newTypeBook = new TypeBook(typeName)
    return newTypeBook.save()
}
module.exports.typesBook = async (page, perPage) =>{
     const totalPage = await TypeBook.countDocuments()
      const skip = (page - 1) * perPage
      const data = await TypeBook.find().skip(skip).limit(perPage)
      return {data: data, totalPage: Math.ceil(totalPage/perPage), currentPage: page, totalDocs: totalPage,  perPage: perPage}
}
module.exports.getTypeBookDetail = (typeBookId)=>{
    
    return TypeBook.findById(typeBookId)
}
module.exports.getBookTypebook = async (typeBookId, page,)=>{
    const totalPage = await Books.countDocuments({type_book: typeBookId})
    const perPage = 5
    const skip = (page - 1) * perPage
    const bookData =  await Books.find({type_book: typeBookId}).populate('author').populate('publishers').skip(skip).limit(perPage)
    return {data: bookData, currentPage: page, totalPage: totalPage}
}
module.exports.updateTypeBook = async (typeBookId, data) =>{
    return TypeBook.updateOne({_id: typeBookId}, data)
}
module.exports.deleteTypeBook = (typeBookId)=>{
    return TypeBook.deleteOne({_id: typeBookId})
}
module.exports.searchTypeBook = (searchKey)=>{
    
}