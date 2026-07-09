const express = require ("express");
const router = express.Router();
const uploads = require("../config/multer");
const productModel = require("../models/product-model");
const {
     createProduct,
     getProduct ,
     editProduct,
     updateProduct,
     myProducts
     } = require("../controllers/productControllers");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

//createProduct
router.get("/createproduct", isLoggedIn,(req,res)=>{
    res.render("createproduct");
})

//getProduct
router.post("/createproduct",isLoggedIn,uploads.single("image"),createProduct);
router.get("/shop",getProduct);  

//updateProduct
router.get('/:id/edit', isLoggedIn, editProduct);
router.put('/:id', isLoggedIn,uploads.single('image'), updateProduct);

//deleteProduct(Handled in myProduct.ejs)


//myProducts(seller products)
router.get("/myProducts", isLoggedIn , myProducts);

module.exports = router; 

