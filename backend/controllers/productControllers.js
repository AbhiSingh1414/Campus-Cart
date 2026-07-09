const productModel = require("../models/product-model");

//Create Product
module.exports.createProduct = async function (req , res){
    try{
        let {productname,price,discount,description } = req.body;
        let image = req.file ? req.file.filename : "";

        if (!productname || price == null) {
            return res.send("Product name and price are required");
        }
        
        let product = await productModel.create({
            productname,
            seller : req.user._id ,
            price,
            image,
            discount,
            description
        })
        req.flash("success", "Product created successfully");
        res.redirect("/products/shop");
    }
    catch(err){
        console.error("createProduct error:",err);
        res.status(500).send("Error creating product");
    }
};

//Get Product
module.exports.getProduct = async function (req , res){
    //find products
    try{
        let products = await productModel
        .find()
        .populate("seller" ,"username");
        //send response
        res.status(200).render("shop", { products });;
    }
    catch(err){
        console.error("getProduct error:",err);
        res.status(500).send("Something went wrong");        
    }
};

//Edit Product
module.exports.editProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // 🔥 Owner check
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).send("Not authorized");
    }

    res.render('editProduct', { product });

  } catch (err) {
    res.status(500).send("Server Error");
  }
};

//Update Product
module.exports.updateProduct = async (req,res) => {
try{
    const{productname , price ,discount , description} = req.body;
    if(!productname || !price){
        req.flash("error", "Product name and price are required");
        return res.redirect(`/products/${req.params.id}/edit`);
    }

    const product = await  productModel.findById(req.params.id);
        if(!product){
        return res.status(404).send("Product not found");
    }

    if(product.seller.toString()!==req.user.id){
        return res.status(403).send("Not authorized");
    }

    //Update Product
    product.productname = productname;
    product.price = price;
    product.description = description;
    product.discount = discount;
    //Update Image if needed
    if(req.file){
        product.image = req.file.filename;
    }

    await product.save();

    req.flash("success", "Product updated successfully");
    res.redirect("/products/shop");
}catch(err){
    console.error("updateProduct error" ,err);
    res.status(500).send("Server Error");
}
}

//My Products
module.exports.myProducts = async(req,res)=>{
    try{
        const products = await productModel.find
        ({seller: req.user._id})
        .populate("seller","username");
        res.render("myProducts",{products});
        
    }catch(err){
        console.error("myProduct error" , err);
        res.status(500).send("Server Error");
    }
}