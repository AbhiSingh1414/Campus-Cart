require('dotenv').config();   // .env file mein jitne v data honge wo saare use mein aa jayenge.

const express = require ("express");                    
const app = express();                                  
const path = require ("path");
const cookieParser = require("cookie-parser");
const flash = require ('connect-flash');
const session = require('express-session')
const uploads =require("./config/multer");

const userModel = require("./models/user-model");
const productModel = require("./models/product-model");

//Routers
const usersRouter = require ("./routes/usersRouter");
const productsRouter = require ("./routes/productsRouter");
const cartRouter = require ("./routes/cartRouter");
const ordersRouter = require("./routes/ordersRouter");
const pageRouter = require("./routes/pageRouter");
const paymentRouter = require('./routes/paymentRouter')

const db = require('./config/mongoose-connection');
const { isLoggedIn } = require('./middlewares/isLoggedIn');



app.set("view engine", "ejs");                                         //
app.use(express.json());                                               //
app.use(express.urlencoded({extended: true}));                         //
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));               //

app.use(session({
    secret : process.env.SESSION_SECRET || "Secrer1212",
    resave : false,
    saveUninitialized : false,
    cookie: { secure: false }
}));

app.use(flash());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});

//Routes
app.use("/users",usersRouter);
app.use("/products",productsRouter);
app.use("/cart",isLoggedIn,cartRouter);
app.use("/orders", ordersRouter);
app.use("/", pageRouter);
app.use("/payment" , paymentRouter);


app.listen(3000,(req,res)=>{                                         //
    console.log("Campus Cart Online")
});