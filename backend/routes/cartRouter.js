const express = require ("express");
const { getCart, addToCart, deleteFromCart ,increaseQuantity , decreaseQuantity } = require("../controllers/cartController");
// const { isLoggedIn } = require("../middleware/isLoggedIn");
const router = express.Router();


router.get("/", getCart);  //wrote "/" instead of "/cart" coz in app.js "app.use("/cart",isLoggedIn,cartRouter)"
router.post("/add/:productId", addToCart);
router.post("/remove/:productId", deleteFromCart);
router.post("/increase/:productId",increaseQuantity);
router.post("/decrease/:productId",decreaseQuantity);


module.exports = router;