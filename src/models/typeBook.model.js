const mongoose = require('mongoose')
const Schema = mongoose.Schema

const typeBookSchema = new Schema ({
    type_name: {type: String, require: true, unique: true},
})
typeBookSchema.index({'$**': 'text'})
const typeBook = mongoose.model('type_book', typeBookSchema)
async function test () {
    // const test = await typeBook.find({type_name: { $regex: /^lịch/, $options: 'mis' } })
    const test = await typeBook.find({$text: {$search: "5fb3387a7a625f44b2e34c8c"}})
}
test()
module.exports = typeBook