const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username : { type : String , required : true },
    email : { type : String , required : true },
    password :{ type : String , required : true },
    image : String,
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user' 
    },
    verified : {
        type : Boolean,
        default : false
    },
    cart : [{
       product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "product"
       },
       quantity : {
        type : Number,
        default : 1
       }
    }],
    orders : [{
        product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "product"
       },
       quantity : {
        type : Number,
        default : 1
       }
    }]
},{timestamps : true})

module.exports = mongoose.model("user",userSchema);