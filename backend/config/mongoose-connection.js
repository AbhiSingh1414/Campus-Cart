const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("dvelopment:mongoose");//yahan changes krne pdenge //Iske doubts clear kro

mongoose
.connect(`${config.get("MONGODB_URI")}/Campus_Cart`)//TBR how to write dynamic value
.then(function(){
    dbgr("Connected");
})
.catch(function(err){
    dbgr(err);
})

module.exports = mongoose.connection;