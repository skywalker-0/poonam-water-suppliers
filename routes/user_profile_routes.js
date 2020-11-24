const user_model=require('../models/user_model.js');
const flash = require('express-flash');
const session = require('express-session');
const express=require('express');
const bcrypt = require('bcryptjs');
const router=express.Router({mergeParams:true});

router.post('/change-password',redirectHome,(req,res)=>{
    // res.render('customerSide/changepwd',{email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart})
    user_model.getUserByEmailId(req.session.email_id, (err, result, fields) => {
        //    console.log("called");
        if (!err){
        // res.send(rows);
                // console.log(result[0].password)
                //  console.log(result[Object.keys(result)[0]]);
                bcrypt.compare(req.body.oldpwd, result[0].password, async(err, res2)=> {
                    if (err){
                      // handle error
                      req.flash('error_msg',err);
                      return res.redirect('/change-password');
                      console.log(err)
                    }
                    if (res2){
                    // console.log(result[0].email_id+" *** "+result[0].user_name)
                    try {
                        const hashedPassword = await bcrypt.hash(req.body.newpwd, 5);
                        user_model.updatePwd(req.session.email_id, hashedPassword, function(err, result) {
                            if (!err) {
                                // console.log("Number of records inserted: " + result.affectedRows); 
                                req.flash('success_msg','Password changed successfully')
                                return res.redirect('/change-password');
                            } else {
                                req.flash('error_msg','Password could not be changed: '+err.code);
                              // console.log(err);
                                return res.redirect('/change-password');
                                // console.log(err);
                                // //alert(err); 
                                // res.redirect("/register");
                            }
                        });
                
                      } catch {
                        return res.redirect('/change-password');
                      }

                    } else {
                      // response is OutgoingMessage object that server response http request
                      req.flash('error_msg','Old password you have entered is incorrect');
                      res.redirect('/change-password');
                    }
                  });
     
        }
        else{
            req.flash('error_msg','Password could not be changed: '+err.code);
            console.log(err);
            return res.redirect('/change-password');
        }
    })

})

router.get('/change-password',redirectHome,(req,res)=>{
    res.render('customerSide/changepwd',{email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart})
})

router.get('/view-profile', redirectHome, (req,res) =>{
    user_model.getUserByEmailId(req.session.email_id, (err, result, fields) => {
        //    console.log("called");
        if (!err){
        // res.send(rows);
            res.render('customerSide/viewprofile.ejs',{user:result[0],email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart})
        }
        else{
            console.log(err);
        }
    })
})

router.post('/edit-profile', redirectHome, (req,res) =>{
    user_model.updateUser(req.session.email_id,req.body, (err, result, fields) => {
    //    console.log("called");
    if (!err){
    // res.send(rows);
    console.log(result)
    req.session.email_id=req.body.email_id;
    req.session.user_name=req.body.user_name;

    req.flash('success_msg','Information has been updated successfully')
    return res.redirect('/edit-profile');    
    }
    else{
        if(err.code == 'ER_DUP_ENTRY')
            req.flash('error_msg','Failed to update the information. The new email id you have entered is already registered.');
        // console.log(err);
        return res.redirect('/edit-profile');
    }
})
})

router.get('/edit-profile', redirectHome, (req,res) =>{
    user_model.getUserByEmailId(req.session.email_id, (err, result, fields) => {
    //    console.log("called");
    if (!err){
    // res.send(rows);
        res.render('customerSide/editprofile.ejs',{user:result[0],email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart})
    }
    else{
        console.log(err);
    }
})
})

function redirectHome(req, res, next) {
    if (typeof req.session.email_id == 'undefined') {
        // console.log(req.session.email_id+" : : "+req.session.user_name);
        return res.redirect('/');
    }
    next();    
  }

module.exports=router;