const driver_model=require('../models/driver_model.js');
const express=require('express');
const flash = require('express-flash');
const session = require('express-session');
const router=express.Router({mergeParams:true});

// app=express()
// app.use(session({
//     name:process.env.SESS_NAME,
//   secret: 'THIS IS A SECRET 1234',
//   resave: false,
//   saveUninitialized: false,
//   cookie:{
//       path:'/',
//       maxAge: 1000*60*60*2,
//       sameSite:true
//     //   secure: true
//   }
// }))

router.put("/drivers/:id",redirectHome,(req,res)=>{
    driver_model.updateDriver(req.params.id,req.body,(err, result)=>{
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

router.delete("/drivers/:id",redirectHome,(req,res)=>{
    driver_model.removeDriver(req.params.id,(err, result)=>{
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

router.get('',(req, res,next) => {
    res.redirect("/dash/drivers");
});

router.get('/drivers',redirectHome,(req, res,next) => {
    driver_model.getDrivers((err,drivers)=>{
        if (!err)
            res.render("adminSide/driver/index", { drivers: drivers , email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
        else
            console.log(err);
    })
});

router.post("/drivers",redirectHome, function(req, res) {
    driver_model.addDriver(req.body,function(err, result) {
            if (!err) {
                res.redirect("/dash/drivers");
            } else {
                console.log(err);
                res.redirect("drivers/new");
            }
        });
});

router.get("/drivers/new",redirectHome, function(req, res) {
    res.render("adminSide/driver/new",{email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin});
});

// router.get("/drivers/:id/edit",(req,res)=>{

// })

function redirectHome(req, res, next) {
    if (typeof req.session.email_id == 'undefined' || req.session.isAdmin == false) {
        // console.log(req.session.email_id+" : : "+req.session.user_name);
        return res.redirect('/');
    }
    next();    
  }

module.exports=router;