const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://sushilk:Sushilk@cluster0.oqkxz.mongodb.net/test";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongo successfully")
        
    })
}

module.exports = connectToMongo;