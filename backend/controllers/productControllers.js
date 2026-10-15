const productModel = require("../models/product-model");
const cloudinary = require('../config/cloudinary');

//Create Product
module.exports.createProduct = async function (req , res){
    try{
        let {productname,price,discount,description,category,stock,imageUrl = ''} = req.body;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }
        if (!imageUrl) return res.status(400).json({ message: "Please upload a product image." });
        let product = await productModel.create({
            productname,
            price,
            discount,
            description,
            category,
            stock,
            imageUrl,
            
            
        })
        const saveProduct = await product.save();
        res.status(200).json({saveProduct});
    }
    catch(err){
        res.status(500).json({message : "Server error",err});
    }
};

//Get Product
module.exports.getProduct = async function (req , res){
    //find products
    try{
        let products = await productModel.find({})
        //send response
        res.json (products);;
    }
    catch(err){
        console.error("getProduct error:",err);
        res.status(500).json({message : 'Server error'});        
    }
};

//Get product by id 
module.exports.getProductById = async (req ,res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if(product){
            res.json(product);
        }else{
            res.json({message : 'Product not found'});
        }
    } catch (error) {
        res.status(500).json({message : 'Server error'});
    }
}

//Update Product
module.exports.updateProduct = async (req,res) => {

    try{
        const{productname , price ,discount , description, category , stock} = req.body;
        const product = await  productModel.findById(req.params.id);
        if(!product){
             return res.status(404).json({message : "Product not found"});
        }

        //Update Product
        if (productname !== undefined) product.productname = productname;
        if (price !== undefined) product.price = price;
        if (description !== undefined) product.description = description;
        if (discount !== undefined) product.discount = discount;
        if (stock !== undefined) product.stock = stock;
        if (category !== undefined) product.category = category;
        if (req.body.imageUrl !== undefined) product.imageUrl = req.body.imageUrl;
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            product.imageUrl = result.secure_url;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    }catch(err){
        res.status(500).json({message : "Server Error"});
    }
}

//Delete Product
module.exports.deleteProduct = async (req ,res) => {
    try {
        const product = await productModel.findById(req.params.id)

        if(!product){
            return res.status(404).send("Product not found");
        }

        await product.deleteOne(); //or await product.remove();
        res.json({message : "Product removved"});
        
    } catch (error) {
        res.status(500).json({message : "server error"});
    }
}

