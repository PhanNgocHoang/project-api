const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: { type: String, required: true},
    displayName: { type: String, required: true},
    password: { type: String},
    fbId: {type: String},
    googleId: { type: String},
    role: { type: Number, required: true, enum:[1, 2], default:1},
    photoUrl: { type: String, required: true}
})

module.exports.User = mongoose.model("users", UserSchema)
