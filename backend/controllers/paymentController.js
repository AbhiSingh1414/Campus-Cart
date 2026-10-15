const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();


module.exports.createdOrder = async function(req,res){
    try {
        const amount = Number(req.body.amount);
        if (!Number.isSafeInteger(amount) || amount < 100) {
            return res.status(400).json({ message: 'Order amount must be at least ₹1 and supplied in paise.' });
        }

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
            return res.status(503).json({ message: 'Razorpay is not configured on the server.' });
        }

        const instance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        const options = {
            // The frontend sends the amount in paise, as required by Razorpay.
            amount,
            currency : "INR",
            receipt : crypto.randomBytes(10).toString("hex"),
        };
        const order = await instance.order.create(options);
        res.status(200).json({ ...order, keyId });
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
