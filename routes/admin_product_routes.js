const product_model=require('../models/product_model.js');
const brand_model=require('../models/brand_model.js');
const express=require('express');
const flash = require('express-flash');
const session = require('express-session');
const multer = require('multer');
const router=express.Router({mergeParams:true});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/assets/customerSide/img/product/');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 5
    // },
    fileFilter: fileFilter
  });


  router.post("/products",redirectHome,upload.single('product_image'),function(req, res) {
    // console.log(req.file);
     product_model.addProduct(req.body,req.file.originalname,function(err, result) {
            if (!err) {
                res.redirect("/dash/products");
            } else {
                console.log(err);
                res.redirect("product/new");
            }
        });
});  

router.get('/products',redirectHome,(req, res,next) => {
    product_model.getProducts((err,products)=>{
        if (!err)
            res.render("adminSide/product/index", { products: products , email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
        else
            console.log(err);
    })
});

router.get("/product/new",redirectHome, function(req, res) {
    brand_model.getBrands((err,availableBrands)=>{
        if(!err){
          res.render('adminSide/product/new',{availableBrands:availableBrands,email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin})
        }
        else{
          console.log(err);
          req.flash('error_msg','Error:'+err)
          return res.redirect("back");
        }
      })
    // res.render("adminSide/product/new",{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
});

router.put("/products/:id",redirectHome,(req,res)=>{
    product_model.updateProduct(req.params.id,req.body,(err, result)=>{
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

router.delete("/products/:id",redirectHome,(req,res)=>{
    product_model.removeProduct(req.params.id,(err, result)=>{
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

function redirectHome(req, res, next) {
    if (typeof req.session.email_id == 'undefined' || req.session.isAdmin == false) {
        // console.log(req.session.email_id+" : : "+req.session.user_name);
        return res.redirect('/');
    }
    next();    
  }

module.exports=router;