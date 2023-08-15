const mongoose = require('mongoose')



const connectionParams = {
    useNewUrlParser:true,
    useUnifiedTopology:true
}

async function connect () {
    try {
        mongoose.set("strictQuery",false)
       await mongoose.connect(process.env.DATABASE_URL,connectionParams)
    } catch (error) {
        console.log("database error :",error)
    }
}

module.exports= {connect}