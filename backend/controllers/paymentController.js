const crypto = require('crypto');
dotenv = require('dotenv').config();


module.exports.createdOrder = async function(req,res){
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount : req.body.amount * 100,
            currency : "INR",
            receipt : crypto.randomBytes(10).toString("hex"),
        };
        const order = await instance.order.create(options);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({message : 'server error',err})
    }
}

module.exports.verifyPayment = async function(req, res) {
    try {
        const {
            razorpay_order_id,
            razorpay_signature,
            razorpay_payment_id
        } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            return res.status(200).json({
                message: "Payment verified successfully"
            });
        }

        return res.status(400).json({
            message: "Payment verification failed"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};