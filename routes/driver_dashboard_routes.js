const express=require('express');
const flash = require('express-flash');
const session = require('express-session');
const router=express.Router({mergeParams:true});
let Cart=require('../models/cart');
const user_model=require('../models/user_model.js');
const order_model=require('../models/order_model.js');
const driver_model=require('../models/driver_model.js');


router.get('/mark-order-delivered',redirectLogin,(req,res)=>{
    order_model.getOrderByDriver(req.session.driver_id,(err,result)=>{
        if(!err){
            if(result[0].order_repeat>0){
                order_model.setNextOrderDate(result[0].order_id,result[0].order_repeat,(err,result)=>{
                    if(!err){
                        driver_model.setDriverStatusAvailable(req.session.driver_id,(err,result)=>{
                            if(!err){
                                req.flash('success_msg','Order marked delivered');
                                res.render("driverSide/assigned_order",{order:null,driver_id: req.session.driver_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
                            }
                            else{
                                req.flash('error_msg','Please try again: '+err);
                                // res.redirect('/assigned-order'); 
                                res.redirect("back");
                            }
                        });
                    }
                    else{
                        req.flash('error_msg','Please try again: '+err);
                        // res.redirect('/assigned-order');
                        res.redirect("back"); 
                    }
                });
            }
            else{
                order_model.setOrderStatusDelivered(result[0].order_id,(err,result)=>{
                    if(!err){
                        driver_model.setDriverStatusAvailable(req.session.driver_id,(err,result)=>{
                            if(!err){
                                req.flash('success_msg','Order marked delivered');
                                // res.render("driverSide/assigned_order",{order:null,driver_id: req.session.driver_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
                                res.redirect("back");
                            }
                            else{
                                req.flash('error_msg','Please try again: '+err);
                                // res.redirect('/assigned-order');
                                res.redirect("back"); 
                            }
                        });
                    }
                    else{
                        req.flash('error_msg','Please try again: '+err);
                        // res.redirect('/assigned-order'); 
                        res.redirect("back");
                    }
                });
            }
        }
        else{
            req.flash('error_msg','Please try again: '+err);
            res.redirect('/assigned-order'); 
        }
    });
});


router.get('/assigned-order',redirectLogin,(req,res)=>{
    order_model.getOrderByDriver(req.session.driver_id,(err,result)=>{
        if(!err){
            if(typeof result[0] !== 'undefined'){
                let orderedCart=new Cart(JSON.parse(result[0].order_items));
                res.render("driverSide/assigned_order",{order:result[0],orderedItems:orderedCart.generateArray(),driver_id: req.session.driver_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
            }
            else{
                res.render("driverSide/assigned_order",{order:null,driver_id: req.session.driver_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
               
            }
        }
        else{

        }
    });
});

router.get('/mark-present',redirectLogin,(req,res)=>{
    driver_model.setDriverStatusAvailable(req.session.driver_id,(err,result)=>{
        if(!err){
            req.flash('success_msg','Marked present')
            res.redirect('/driver-dash')
        }
        else{
            req.flash('error_msg','Please try again')
            res.redirect('/driver-dash')     
        }
    })
})

router.get('/mark-absent',redirectLogin,(req,res)=>{
    driver_model.setDriverStatusAbsent(req.session.driver_id,(err,result)=>{
        if(!err){
            req.flash('error_msg','Marked Absent')
            res.redirect('/driver-dash')
        }
        else{
            req.flash('error_msg','Please try again')
            res.redirect('/driver-dash')
        }
    })
})

router.post('/change-password',redirectLogin,(req,res)=>{ 
    driver_model.getDriverById(req.session.driver_id,(err,result)=>{
        if(result[0].password==req.body.oldpwd){
            driver_model.updatePwd(req.session.driver_id,req.body.newpwd,(err,result)=>{
                if(!err){
                    req.flash('success_msg','Password changed successfully')
                    return res.redirect('/driver-dash/change-password');
                }
                else{
                    req.flash('error_msg','Password could not be changed:'+err);
                    return res.redirect('/driver-dash/change-password');
                }
            });
        }
        else{
            req.flash('error_msg','Old password you have entered is incorrect');
            return res.redirect('/driver-dash/change-password');
        }
    })
});

router.get('/change-password',redirectLogin,(req,res)=>{ 
    res.render('driverSide/changepwd',{driver_id:req.session.driver_id,user_name:req.session.user_name})
});


router.get('/',redirectLogin,(req,res)=>{ 
    res.render('driverSide/absent',{driver_id:req.session.driver_id,user_name:req.session.user_name})
});

function redirectLogin(req, res, next) {
    if (!req.session.driver_id) {
        // console.log("user is authenticated.....%%%%%%%%%")
      return res.redirect('/login-driver');
    }
    // console.log("user not authenticated.....%%%%%%%%%")
    next();
  }

module.exports=router;