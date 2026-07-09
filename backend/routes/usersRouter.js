const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const { registerUser, loginUser, logoutUser } = require("../controllers/authControllers");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const userModel = require("../models/user-model");
//Get /users/router
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register",upload.single("image"),registerUser);

//Get /users/login
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/profile",isLoggedIn, async(req,res)=>{
    let user = await userModel.findById(req.user._id);
    res.render("profile",{user});
})

module.exports = router;