const express = require ("express");
const router = express.Router();
const uploads = require("../config/multer");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { admin } = require('../middlewares/admin');
const {
     createProduct,
     getProduct ,
     updateProduct,
     deleteProduct,
     getProductById
     } = require("../controllers/productControllers");
     
//all Products
router.route('/')
.get(getProduct)
.post(isLoggedIn ,admin , uploads.single('image') ,createProduct);

//specific product
router.route('/:id')
.get(getProductById)
.put(isLoggedIn ,admin , uploads.single('image'),updateProduct)
.delete(isLoggedIn ,admin ,deleteProduct)

module.exports = router;

