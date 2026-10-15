const express  = require ('express');
const router = express.Router();
const {createdOrder , verifyPayment} = require('../controllers/paymentController.js')
const { isLoggedIn } = require('../middlewares/isLoggedIn');

router.post('/order', isLoggedIn, createdOrder);
router.post('/verify', isLoggedIn, verifyPayment);

module.exports = router;
