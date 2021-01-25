const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "books" },
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" },
    price: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    endAt: { type: Date, required: true }
})
OrderSchema.index({ '$**': 'text' })
const Order = mongoose.model('orders', OrderSchema)
module.exports = Order