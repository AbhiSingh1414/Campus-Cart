const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("dvelopment:mongoose");//yahan changes krne pdenge //Iske doubts clear kro

mongoose
.connect(config.get("MONGODB_URI")) //It was .connect('${config.get("MONGODB_URI")}/Campus_Cart') previously before MongoDB Atlas//
.then(function(){
    console.log('MongoDB Connected');
    
    dbgr("Connected");
})
.catch(function(err){
    console.log('MongoDB Connection error',err);
    dbgr(err);
    
})

module.exports = mongoose.connection;