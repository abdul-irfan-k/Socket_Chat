const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Userschema = new Schema({
    username:String,
    email:String,
    password:String,
    createdAt:{type:String,default:new Date().toDateString()},
    Fileurl:String
})

module.exports = mongoose.model('User',Userschema)  