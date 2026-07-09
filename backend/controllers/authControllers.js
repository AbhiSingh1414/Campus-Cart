const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async function (req , res){
try{
    let{username ,email , password } = req.body;
    let image = req.file ? req.file.filename : "";

//Check if user exists
let user = await userModel.findOne({email});
if(user) return res.status(409).send("User already exists");

//If doesn't, Create a user and store the password in hash   (use bcrypt)
//use the generated hash to generate  the password

    bcrypt.genSalt(10, function(err,salt){
        bcrypt.hash(password,salt, async function(err ,hash){
            if (err) return res.send(err.message);
            else{
                let user = await userModel.create({
                    username,
                    email,
                    password : hash ,
                    image
                });
                if(user){
                    const otp = Math.floor(100000 + Math.random()*900000).toString();

                    const message = `Welcome to Campus Cart, ${name} ! Thankyou for regestering with us. We are excited to have you.
                    Your OTP for Campus Cart regestration is ${otp}`

                    await sendMail(email,'Welcome to Campus Cart. Your OTP for regestration ' , message)
                }
                let token = generateToken(user);
                res.cookie ("token" , token);
                res.status(201).json({message : 'User registered successfully. Please check ypur email for OTP'})
        };
    })
})
}catch(err){
    console.error("Register Error:" , err);
    res.send(err.message);
}

};

module.exports.loginUser = async function (req , res){
    try{
        let {email , password} = req.body;
        //Find the user
        let user = await userModel.findOne({email});
        //if doesn't exist (msg)
        if(!user) return res.status(404).send("User doesn't exist")
        //if exists then compare password
        bcrypt.compare(password,user.password,function (err , result){
            if(result){
                let token = generateToken(user);
                res.cookie ("token" , token);
                res.redirect ("/users/profile");
            }
            else{
                res.send("email or password incorrect")
            }
        })     
    }
    catch(err){
        console.error("Login error:",err);
        res.send ("email or password incorrect");
    }
};

module.exports.logoutUser = function(req ,res){
    let token = res.cookie("token", "");
    res.redirect ("/users/login")
}
    



