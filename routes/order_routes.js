const express=require('express');
const flash = require('express-flash');
const session = require('express-session');
const router=express.Router({mergeParams:true});
let Cart=require('../models/cart');
const user_model=require('../models/user_model.js');
const order_model=require('../models/order_model.js');

router.post('/orders/:id',redirectLogin,(req,res)=>{
    console.log("*****************REACHED HERE**********")
    order_model.setOrderStatusCancelled(req.params.id,(err, result)=>{
        if(!err){
            req.flash('success_msg','Order cancelled.')
            res.redirect("back");
        }else{
            console.log(err);
            req.flash('error_msg','Could not be cancelled :'+err)
            res.redirect("back");
        }     
    })
});

router.get('/orders/:id',redirectLogin,(req,res)=>{
    order_model.getOrderById(req.params.id,(err,result)=>{
        if(!err){
            let orderedCart=new Cart(JSON.parse(result[0].order_items));
            res.render("customerSide/orders/show",{order:result[0],orderedItems:orderedCart.generateArray(),email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
        }
        else{

        }
    })
})

router.get('/orders',redirectLogin,(req,res)=>{
    order_model.getOrdersByEmail(req.session.email_id,(err,orders)=>{
        if (!err)
            res.render("customerSide/orders/index", {  orders:orders.length>0 ? orders : null, email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
        else
            console.log(err);
    })
})

function redirectLogin(req, res, next) {
    if (!req.session.email_id) {
        // console.log("user is authenticated.....%%%%%%%%%")
      return res.redirect('/login');
    }
    // console.log("user not authenticated.....%%%%%%%%%")
    next();
  }

module.exports=router;
