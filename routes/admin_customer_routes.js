const user_model=require('../models/user_model.js');
const express=require('express');
const flash = require('express-flash');
const session = require('express-session');
const router=express.Router({mergeParams:true});

router.put("/users/:id",redirectHome,(req,res)=>{
  user_model.updateUser(req.params.id,req.body,(err, result)=>{
      if(!err){
          req.flash('success_msg','Changes saved successfully.')
          res.redirect("back");
      }else{
          console.log(err);
          req.flash('error_msg','Changes could not be saved: '+err)
          res.redirect("back");
      }     
  })
})

router.delete("/users/:id",redirectHome,(req,res)=>{
  user_model.removeUser(req.params.id,(err, result)=>{
      if(!err){
          req.flash('success_msg','Deletion successful.')
          res.redirect("back");
      }else{
          console.log(err);
          req.flash('error_msg','Could not be deleted :'+err)
          res.redirect("back");
      }     
  })
})

router.get('/users',redirectHome,(req, res,next) => {
  user_model.getCustomers((err,users)=>{
      if (!err)
          res.render("adminSide/users/index", { users: users , email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
      else
          console.log(err);
  })
});

function redirectHome(req, res, next) {
    if (typeof req.session.email_id == 'undefined' || req.session.isAdmin == false) {
        // console.log(req.session.email_id+" : : "+req.session.user_name);
        return res.redirect('/');
    }
    next();    
  }

module.exports=router;