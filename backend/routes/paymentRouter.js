const express  = require ('express');
const router = express.Router();
const {createdOrder , verifyPayment} = require('../controllers/paymentController.js')

router.post('/order', createdOrder);
router.post('/verify', verifyPayment);

module.exports = router;