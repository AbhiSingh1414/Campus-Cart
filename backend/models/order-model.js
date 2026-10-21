const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref: 'user',required: true},
    items : [
        {
            productId : {type : mongoose.Schema.Types.ObjectId , ref: 'product',required: true},
            quantity : {type : Number , required : true , min :1},
            price : {type : String ,required : true}
        }
    ],
    totalAmount : {type : Number ,required : true},
    address : [
        {
            fullName : {type : String ,required : true},
            phone : {type : String ,required : true},
            street : {type : String ,required : true},
            city : {type : String ,required : true},
            postalCode : {type : String ,required : true},
            country : {type : String ,default : 'India'}
        }
    ],
    paymentId : {type : String},
    status : {type : String,enum: ['pending','shipped','delivered'] ,default :'pending'}
},{timestamps : true})

module.exports = mongoose.model("orders",orderSchema)
