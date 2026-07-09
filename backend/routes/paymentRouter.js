const express  = require ('express');
const router = express.Router();
const {isLoggedIn} = require ('../middlewares/isLoggedIn');

router.post('/paymentMethod', isLoggedIn, async (req, res) => {
    let { paymentMethod } = req.body;

    console.log(paymentMethod);

    // store in session/db if needed

    return res.redirect("/payment/paymentPage");
});

router.get('/paymentMethod' , isLoggedIn , async(req ,res) => {
    res.render("paymentMethod")
})

router.get('/paymentPage',isLoggedIn ,async(req, res) =>{
    res.render("paymentPage")
})


module.exports = router;