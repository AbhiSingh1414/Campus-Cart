const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productname : { type : String , required : true },
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    price : { type : Number , required : true } ,
    image : String,
    discount : {
        type : Number,
        default : 0
    },
    description : String 
},{timestamps : true})

module.exports = mongoose.model("product",productSchema);