const product_model=require('../models/product_model.js');
const flash = require('express-flash');
const session = require('express-session');
const express=require('express');
const router=express.Router({mergeParams:true});
let Cart=require('../models/cart');

router.get("/products/:id", function(req, res) {
    product_model.getProductById(req.params.id,(err,result,fields)=>{
        if(!err){
            res.render("customerSide/single-product",{product:result[0],email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart});
        }
        else{
            console.log(err);
            return res.redirect('/');
        }
    });    
});

router.get("/products", function(req, res) {
    product_model.getProducts((err, products, fields) => {
        if (!err)
        // res.send(rows);
            res.render("customerSide/products", { products: products, email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart});
        else{
            console.log(err);
            return res.redirect('/');
        }
    })
});

router.put("/add-to-cart/:id",(req,res)=>{
    let cart=new Cart(req.session.cart ? req.session.cart : {});
    product_model.getProductById(req.params.id,(err,result,fields)=>{
        if(!err){
            if(typeof req.body.qty !== 'undefined'){
                cart.addMultiple(result[0],result[0].product_id,req.body.qty);
                req.session.cart=cart;
                res.redirect('/products');
            }
            else{
           cart.add(result[0],result[0].product_id);
           req.session.cart=cart;
        //    console.log(req.session.cart);
            res.redirect('/products');
        // console.log(result[0]);
            }
        }
        else{
            console.log(err);
            return res.redirect('/');
        }
    });     
});

router.get("/add-to-cart/:id",(req,res)=>{
    let cart=new Cart(req.session.cart ? req.session.cart : {});
    product_model.getProductById(req.params.id,(err,result,fields)=>{
        if(!err){
           cart.add(result[0],result[0].product_id);
           req.session.cart=cart;
        //    console.log(req.session.cart);
            res.redirect('/products');
        // console.log(result[0]);
        }
        else{
            console.log(err);
            return res.redirect('/');
        }
    });     
});

router.delete("/cart/remove/:id",(req,res)=>{
    if(!req.session.cart){
        return res.redirect('/cart');
    }
    let cart=new Cart(req.session.cart);
    cart.removeOne(req.params.id);
    req.session.cart=cart;
    res.redirect('/cart');
});


router.delete("/cart/remove-all/:id",(req,res)=>{
    if(!req.session.cart){
        return res.redirect('/cart');
    }
    let cart=new Cart(req.session.cart);
    cart.removeAll(req.params.id);
    req.session.cart=cart;
    res.redirect('/cart');
});


router.get("/cart",(req,res)=>{
    if(!req.session.cart){
        res.render("customerSide/cart",{ email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cartItems:null});
    }
    let cart=new Cart(req.session.cart);
    // console.log(cart.generateArray()+'************************************************************************************')
    res.render("customerSide/cart",{ email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cartItems:cart.generateArray().length>0 ? cart.generateArray() : null, totalPrice:cart.totalPrice});
});

module.exports=router;