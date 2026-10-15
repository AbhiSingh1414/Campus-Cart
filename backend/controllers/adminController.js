const orderModel = require('../models/order-model');
const userModel = require('../models/user-model');
const productModel = require('../models/product-model')

module.exports.getAdminStats = async function(req,res){
    try {
        const totalUsers = await userModel.countDocuments({role:'user'});
        const totalOrders = await orderModel.countDocuments({});
        const totalProducts = await productModel.countDocuments({});
        
        const orders = await orderModel.find({});

        const totalRevenue = orders.reduce((acc,order) => acc + Number(order.totalAmount || 0), 0);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue
        });

    } catch (error) {
        res.status(500).json({message : 'Error fetching stats' , error});
    }
};
