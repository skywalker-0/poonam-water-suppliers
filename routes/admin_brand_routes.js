const brand_model=require('../models/brand_model.js');
const express=require('express');
const flash = require('express-flash');
const session = require('express-session');
const router=express.Router({mergeParams:true});

router.post("/brands",redirectHome, function(req, res) {
  brand_model.addBrand(req.body,function(err, result) {
          if (!err) {
              res.redirect("/dash/brands");
          } else {
              console.log(err);
              res.redirect("brands/new");
          }
      });
});

router.get("/brands/new",redirectHome, function(req, res) {
  res.render("adminSide/brand/new",{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
});

router.put("/brands/:id",redirectHome,(req,res)=>{
    brand_model.updateBrand(req.params.id,req.body,(err, result)=>{
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
  
  router.delete("/brands/:id",redirectHome,(req,res)=>{
    brand_model.removeBrand(req.params.id,(err, result)=>{
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

router.get('/brands',redirectHome,(req,res)=>{
    brand_model.getBrands((err,brands)=>{
      if(!err){
          // console.log(brands);
            res.render('adminSide/brand/index',{brands:brands.length>0? brands: null,email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin})
      }
      else{
        console.log(err);
        req.flash('error_msg','Error:'+err)
        return res.render('adminSide/brand/index',{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
      }
    });    
  });

function redirectHome(req, res, next) {
    if (typeof req.session.email_id == 'undefined' || req.session.isAdmin == false) {
        // console.log(req.session.email_id+" : : "+req.session.brands_name);
        return res.redirect('/');
    }
    next();    
  }

module.exports=router;