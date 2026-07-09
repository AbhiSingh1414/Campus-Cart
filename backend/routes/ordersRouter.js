const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const userModel = require("../models/user-model");
// const axios = require('axios');

router.get("/checkout", isLoggedIn, async (req, res) => {
    let user = await userModel
        .findById(req.user._id)
        .populate("cart.product");

    res.render("checkout", { cart: user.cart });
});


router.post("/place", isLoggedIn, async (req, res) => {
    let user = await userModel.findById(req.user._id);

    // Save order (simple version)
    user.orders.push({
        items: user.cart,
        phone: req.body.phone,
        pincode: req.body.pincode,
        city: req.body.city,
        state: req.body.state,
        address: req.body.address
    });

    // Clear cart
    user.cart = [];

    await user.save();

    res.send("Order placed successfully ✅");
});

router.get('/',isLoggedIn,async(req,res)=>{

    const user = await userModel
    .findById(req.user.id)
    .populate('orders.product')

    res.render("orders",{orders : user.orders})
})


module.exports = router;