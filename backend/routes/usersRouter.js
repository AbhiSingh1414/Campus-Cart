const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const { registerUser, loginUser, logoutUser , getUsers } = require("../controllers/authControllers");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const {admin} = require ('../middlewares/admin')
const userModel = require("../models/user-model");

router.post("/register",upload.single("image"),registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser); //

router.get("/allUsers" ,isLoggedIn , admin, getUsers);

router.get("/profile",isLoggedIn, async(req,res)=>{
    let user = await userModel.findById(req.user._id);
    res.render("profile",{user});
})

module.exports = router;