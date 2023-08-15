const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Messageschema = new Schema({
    senderId: String,
    senderName: String,
    receiverId: String,
    receiverName: String,
    message: String,
    isGroupMsg: {
        type: Boolean, default: false
    },
    createdAt: { type: String, default: new Date().toDateString() },
})

module.exports = mongoose.model('Message', Messageschema)