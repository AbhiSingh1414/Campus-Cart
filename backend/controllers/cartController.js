const userModel = require("../models/user-model");

// Helper function to calculate subtotal and total
function calculateCart(cart) {
    let totalPrice = 0;

    const cartItems = cart.map(item => {
        // safety check
        if (!item.product) return null;

        const discount = item.product.discount || 0;
        const discountedPrice = item.product.price - (item.product.price * discount / 100);
        const itemSubtotal = discountedPrice * item.quantity;

        totalPrice += itemSubtotal;

        return {
            productId: item.product._id,
            name: item.product.productname,
            price: item.product.price,
            image: item.product.image,
            discount,
            quantity: item.quantity,
            subtotal: itemSubtotal,
            discountedPrice
        };
    }).filter(item => item !== null); // remove broken items

    return { cartItems, totalPrice };
};

// Show cart
module.exports.getCart = async function(req, res) {
    try {
        let user = await userModel
            .findById(req.user._id)
            .populate("cart.product");
            user.cart = user.cart.filter(item => item.product != null);
            await user.save();

        const { cartItems, totalPrice } = calculateCart(user.cart);

        res.render("cart", { cartItems, totalPrice });

    } catch (err) {
        console.error("getCart error:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Add to cart
module.exports.addToCart = async function(req, res) {
    try {
        let user = await userModel.findById(req.user._id);

        let item = user.cart.find(
            item => item.product.toString() === req.params.productId
        );

        if (item) {
            item.quantity += 1;
        } else {
            user.cart.push({
                product: req.params.productId,
                quantity: 1
            });
        }

        await user.save();
        res.redirect("/products/shop");

    } catch (err) {
        console.error("addToCart error:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Remove from cart
module.exports.deleteFromCart = async function(req, res) {
    try {
        let user = await userModel.findById(req.user._id);

        let item = user.cart.find(
            item => item.product.toString() === req.params.productId
        );

        if (!item) return res.status(404).send("Item not found in cart");

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            user.cart = user.cart.filter(
                item => item.product.toString() !== req.params.productId
            );
        }

        await user.save();
        res.redirect("/cart");

    } catch (err) {
        console.error("deleteFromCart error:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports.increaseQuantity = async function(req, res){
    try {
        let user = await userModel.findById(req.user._id);

        let item = user.cart.find(
            item => item.product.toString() === req.params.productId
        );

        if (item) {
            item.quantity += 1;
        }

        await user.save();
        res.redirect("/cart");

    } catch (err) {
        console.error("increaseQuantity error:", err);
        res.status(500).send("Something went wrong");
    }
 }


module.exports.decreaseQuantity = async function(req ,res){
    
try{
         let user = await userModel.findById(req.user._id);

    let item = user.cart.find(
        item => item.product.toString() === req.params.productId
    );

    if (item) {
        item.quantity -= 1;

        // remove item if quantity becomes 0
        if (item.quantity <= 0) {
            user.cart = user.cart.filter(
                item => item.product.toString() !== req.params.productId
            );
        }
    }

    await user.save();
    res.redirect("/cart");
    }catch(err){
        console.error("decreaseQuantity error : ",err)
        res.status(500).send("Something went wrong");
}
};
