const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Groupschema = new Schema({
    groupName:String,
    creatorName:String,
    creatorId:String,
    admins:{
        type:[String],default:[]
    },
    users:{
        type:[String],default:[],
    },
    createdAt:{type:String,default:new Date().toDateString()},
    Fileurl:String
})

module.exports = mongoose.model('Group',Groupschema)