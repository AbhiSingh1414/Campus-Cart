const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productname : { type : String , required : true },
    price : { type : Number , required : true } ,
    discount : {type : Number , default : 0},
    description :{type : String , required : true},
    category : {type : String , required : true},
    stock : {type : Number ,required : true},
    imageUrl : {type : String , required : true},
    rating : {type : Number , default : 0},
    numReviews : {type : Number ,default : 0}

},{timestamps : true});

module.exports = mongoose.model("product",productSchema);