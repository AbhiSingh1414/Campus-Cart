const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const sendEmail = require('../utils/sendEmail')
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async function (req , res){
try{
    let{username ,email , password } = req.body;
    let image = req.file ? req.file.filename : "";

//Check if user exists
let user = await userModel.findOne({email});
if(user) return res.status(409).json({ message: "User already exists" });

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

                    const message = `Welcome to Campus Cart, ${username} ! Thankyou for regestering with us. We are excited to have you.
                    Your OTP for Campus Cart regestration is ${otp}`

                    await sendEmail(email,'Welcome to Campus Cart. Your OTP for regestration ' , message);

                    res.status(201).json({
                        _id  : user.id,
                        username : user.username,
                        email : user.email,
                        role : user.role,
                        token : generateToken(user)
                    })
                }
        };
    })
})
}catch(err){
    console.error("Register Error:" , err);
    res.json({message : `Server error` });
}

};

module.exports.loginUser = async function (req , res){
    try{
        let {email , password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        //Find the user
        let user = await userModel.findOne({email});
        if (!user) {
            return res.status(401).json({ message: 'Email or password is incorrect.' });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Email or password is incorrect.' });
        }

        return res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user),
        });
    }
    catch(err){
        console.error("Login error:",err);
        return res.status(500).json({ message: 'Unable to log in right now.' });
    }
};

module.exports.getUsers = async function(req ,res){
    try{let users = await userModel.find({}).select(-password); //will provide users data except password
        res.json(users);
    }catch(error){
        res.json({message : `Server error`})
        }
}

module.exports.logoutUser = function(req ,res){
    let token = res.cookie("token", "");
    // res.redirect ("/users/login")
}
    



