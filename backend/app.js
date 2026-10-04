require('dotenv').config();   // .env file mein jitne v data honge wo saare use mein aa jayenge.

const express = require ("express");   
const cors = require('cors');                 
const app = express();                                  
const path = require ("path");
const cookieParser = require("cookie-parser");
const flash = require ('connect-flash');
const session = require('express-session')
const uploads =require("./config/multer");


//Routers
const usersRouter = require ("./routes/usersRouter");
const productsRouter = require ("./routes/productsRouter");
const ordersRouter = require("./routes/ordersRouter");
const paymentRouter = require('./routes/paymentRouter');
const adminRouter = require("./routes/adminRouter");

const db = require('./config/mongoose-connection');





app.use(cors(
    {
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ],
        credentials: true
    }
));
app.use(express.json());        
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
app.use("/orders", ordersRouter);
app.use("/payment" , paymentRouter);
app.use("/analytics" , adminRouter);


app.get("/", (req, res) => {
    res.send("CampusCart Backend is running");
});

app.listen(3000,(req,res)=>{                                         //
    console.log("Campus Cart Online")
});
