const orderModel = require("../models/order-model");
const sendEmail = require("../utils/sendEmail"); 

module.exports.createOrder = async function(req ,res){
    try{
        const {items ,totalAmount, address, paymentId} = req.body;
        if(!items||items.length === 0 || !address){
            return res.status(400).json({message  : 'Invalid Order Data'});
        }
        else{
            const order = await orderModel.create({
                user : req.user._id, 
                items,
                totalAmount,
                address,
                paymentId
        })
            await order.save();
            const message = `🎉 Order placed successfully! \n Dear ${req.user.username}, Thank you for shopping with CampusCart. Your order with order id : ${order._id} has been confirmed and will be processed shortly.You can check your order details and track its status from your Orders section.`

            await sendEmail(req.user.email, 'Order Created', message)
            return res.status(201).json({message : 'Order created successfully',order});
        }      
    }
    catch(err){

    }
}

module.exports.myOrders = async function(req,res) {
    try{
        const orders = await orderModel.find({user: req.user._id}).     populate('items.productId','productname price');
        res.json(orders);
    }catch(err){
        res.status(500).json({message : 'Error fetching orders',err})
    }
};

module.exports.getOrders = async function(req,res){
    try {
        const orders = await orderModel.find({}).populate('user','id productname');
        res.json(orders);
    } catch (err) {
        res.status(500).json({message : 'Error fetching orders',err});
    }
};

module.exports.updateOrderStatus = async function(req,res){
    try {
        const { status } = req.body;
        const order = await orderModel.findById(req.params.id);
        if(order){
            order.status = status;
            await order.save();
            res.json({message : 'Order status updated',order})
        }else{
            res.status(404).json({message : 'Order not found'})
        }
    } catch (err) {
        res.status(500).json({message : 'Error updating order status',err});
    }
};