const jwt = require ("jsonwebtoken");
const userModel = require("../models/user-model");


module.exports.isLoggedIn = async function(req,res,next){
    //find token
    if (!req.cookies.token){
        res.clearCookie("token");
        return res.redirect("/users/login");
    }    
    //If exist    
    try{
        //verification using jwt.verify
        let decoded = jwt.verify(req.cookies.token,process.env.JWT_SECRET);
        let user = await userModel
        .findById(decoded.id)
        .select("-password");

        req.user = user;
        next();
        
    //if failed ("/")
    }catch(err){
        console.error("isLoggedIn error:",err);
        res.status(401).send("Invalid or Expired Token. Please Login");
    }
            //else store user decoded into req.user
};