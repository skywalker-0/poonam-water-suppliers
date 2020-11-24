const express = require("express");
const mysql = require('mysql');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const admin_driver_routes=require('./routes/admin_driver_routes.js');
const admin_product_routes=require('./routes/admin_product_routes.js');
const admin_orders_routes=require('./routes/admin_orders_routes.js');
const admin_brand_routes=require('./routes/admin_brand_routes.js');
const admin_customer_routes=require('./routes/admin_customer_routes.js');
const driver_dashboard_routes=require('./routes/driver_dashboard_routes.js');
const products_routes=require('./routes/products_routes.js');
const index_routes=require('./routes/index.js');
const user_profile_routes=require('./routes/user_profile_routes.js');
const payment_route=require('./routes/payment_route.js');
const order_routes=require('./routes/order_routes.js');

const app = express();

const{
    SESS_NAME='sid'
}= process.env


app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json()); //mysql
app.use(express.static("public"));

app.use(session({
    name:SESS_NAME,
  secret: 'THIS IS A SECRET 1234',
  resave: false,
  saveUninitialized: false,
  cookie:{
      path:'/',
      maxAge: 1000*60*60*2,
      sameSite:true
    //   secure: true
  }
}))
app.use(flash())
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// app.use(passport.initialize())
// app.use(passport.session())
app.use(methodOverride('_method'))

app.use(function(req,res,next){
    res.locals.session=req.session; 
    next();
});

app.use("/dash",admin_driver_routes)
app.use("/dash",admin_product_routes)
app.use("/dash",admin_brand_routes)
app.use("/dash",admin_customer_routes)
app.use("/dash",admin_orders_routes)
app.use("/driver-dash",driver_dashboard_routes)
app.use(products_routes)
app.use(index_routes)
app.use(user_profile_routes)
app.use(payment_route)
app.use(order_routes)



var mysqlConnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'poonamwatersuppliers',
    multipleStatements: true,
    port: 3306
});

app.get("/customer", function(req, res) {
    res.render("customerSide/index");
});

app.get("*", function(req, res) {
    res.render("extra_404_error");
})
app.listen(3010, function() {
    console.log("Server has started on port 3010");
});

module.exports=app
