const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { admin } = require("../middlewares/admin");
const{createOrder,getOrders,myOrders,updateOrderStatus} = require("../controllers/ordersController");
// const axios = require('axios');

router.route('/').post(isLoggedIn,createOrder).get(isLoggedIn , admin , getOrders);
router.route('/myOrders').get(isLoggedIn , myOrders);
router.route('/:id/status').put(isLoggedIn , admin , updateOrderStatus);


module.exports = router;