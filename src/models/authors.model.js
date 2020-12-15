const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AuthorsSchema = new Schema({
    authorName: {type: String, required: true}
})

module.exports.Authors = mongoose.model('authors', AuthorsSchema)