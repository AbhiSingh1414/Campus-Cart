const mongoose = require("mongoose");
const dbgr = require("debug")("dvelopment:mongoose");//yahan changes krne pdenge //Iske doubts clear kro

const mongoUri = process.env.MONGODB_URI || (
    process.env.NODE_ENV === "production"
        ? undefined
        : require("./development.json").MONGODB_URI
);

if (!mongoUri) {
    throw new Error("MONGODB_URI must be configured in the environment.");
}

mongoose
.connect(mongoUri)
.then(function(){
    console.log('MongoDB Connected');
    
    dbgr("Connected");
})
.catch(function(err){
    console.log('MongoDB Connection error',err);
    dbgr(err);
    
})

module.exports = mongoose.connection;
