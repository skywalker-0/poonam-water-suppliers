const express=require('express');
const flash = require('express-flash');
const session = require('express-session');
const router=express.Router({mergeParams:true});
let Cart=require('../models/cart');
const user_model=require('../models/user_model.js');
const order_model=require('../models/order_model.js');
const driver_model=require('../models/driver_model.js');

router.post('/assign-driver/:order_id',redirectHome,(req,res)=>{
  order_model.setAssignedDriverToOrder(req.params.order_id,req.body.available_drivers,(err,result)=>{
    if(!err){
      driver_model.setDriverStatusAssigned(req.body.available_drivers,(err, result)=>{
        if(!err){
          req.flash('success_msg','Driver has been assigned.')
          return res.redirect('/dash/pending-orders');
        }
        else{
          console.log(err);
          req.flash('error_msg','Could not be assigned :'+err)
          res.redirect('/dash/pending-orders');
        }
      })
    }
    else{
      console.log(err);
      req.flash('error_msg','Could not be assigned :'+err)
      return res.redirect('/dash/pending-orders');
    }
  });    
});

router.get('/orders/:id',redirectHome,(req,res)=>{
  order_model.getOrderById(req.params.id,(err,result)=>{
      if(!err){
        if(result[0]){
          let orderedCart=new Cart(JSON.parse(result[0].order_items));
          res.render("adminSide/order/show",{order:result[0],orderedItems:orderedCart.generateArray(),email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
        }
        else{
          res.redirect('/dash');
        }
       }
      else{
        res.redirect('/dash');
      }
  })
})

router.get('/pending-orders',redirectHome,(req,res)=>{
  order_model.getPendingOrdersForToday((err,pendingOrders)=>{
    if(!err){
      driver_model.getAvailableDrivers((err,availableDrivers)=>{
        if(!err){
          res.render('adminSide/order/pending',{availableDrivers:availableDrivers, pendingOrders:pendingOrders.length>0? pendingOrders: null,email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin})
        }
        else{
          console.log(err);
          req.flash('error_msg','Error:'+err)
          return res.render('adminSide/order/pending',{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
        }
      })
      
    }
    else{
      console.log(err);
      req.flash('error_msg','Error:'+err)
      return res.render('adminSide/order/pending',{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
    }
  });    
});

router.get('/missed-orders',redirectHome,(req,res)=>{
  order_model.getMissedPendingOrders((err,pendingOrders)=>{
    if(!err){
      driver_model.getAvailableDrivers((err,availableDrivers)=>{
        if(!err){
          res.render('adminSide/order/pending',{availableDrivers:availableDrivers, pendingOrders:pendingOrders.length>0? pendingOrders: null,email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin})
        }
        else{
          console.log(err);
          req.flash('error_msg','Error:'+err)
          return res.render('adminSide/order/pending',{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
        }
      })
      
    }
    else{
      console.log(err);
      req.flash('error_msg','Error:'+err)
      return res.render('adminSide/order/pending',{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
    }
  });    
});

router.get('/delivered-orders',redirectHome,(req,res)=>{
  order_model.getDeliveredOrders((err,assignedOrders)=>{
    if(!err){
          res.render('adminSide/order/assigned',{assignedOrders:assignedOrders.length>0? assignedOrders: null,email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin})
    }
    else{
      console.log(err);
      req.flash('error_msg','Error:'+err)
      return res.render('adminSide/order/assigned',{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
    }
  });    
});

router.get('/assigned-orders',redirectHome,(req,res)=>{
  order_model.getAssignedOrders((err,assignedOrders)=>{
    if(!err){
          res.render('adminSide/order/assigned',{assignedOrders:assignedOrders.length>0? assignedOrders: null,email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin})
    }
    else{
      console.log(err);
      req.flash('error_msg','Error:'+err)
      return res.render('adminSide/order/assigned',{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
    }
  });    
});


router.get('/all-orders',redirectHome,(req,res)=>{
  order_model.getOrders((err,orders)=>{
    if(!err){
        // console.log(orders);
          res.render('adminSide/order/index',{orders:orders.length>0? orders: null,email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin})
    }
    else{
      console.log(err);
      req.flash('error_msg','Error:'+err)
      return res.render('adminSide/order/index',{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
    }
  });    
});


function redirectHome(req, res, next) {
    if (typeof req.session.email_id == 'undefined' || req.session.isAdmin == false) {
        // console.log(req.session.email_id+" : : "+req.session.user_name);
        return res.redirect('/');
    }
    next();    
  }

module.exports=router;