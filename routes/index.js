const user_model=require('../models/user_model.js');
const driver_model=require('../models/driver_model.js');
const express=require('express');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');
const session = require('express-session');
var generator = require('generate-password');
const nodemailer = require("nodemailer");
const router=express.Router({mergeParams:true});

router.get("/", function(req, res) {
    // res.render("driver/index");
    // console.log(req.session)
    // console.log(req.session.email_id+" : : "+req.session.user_name);
    res.render("customerSide/index",{ email_id: req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart});
});




router.post('/login', redirectHome, (req,res) =>{
    const{email_id,password}=req.body

        user_model.getUserByEmailId(email_id, (err, result, fields) => {
        //    console.log("called");
        if (!err){
        // res.send(rows);
            if(result.length==0){
                // console.log("No such email id in database")
                req.flash('error_msg',"Email ID that you've entered is unregistered")
                res.redirect('/login');
            }
            else{
                // console.log(result[0].password)
                //  console.log(result[Object.keys(result)[0]]);
                
                bcrypt.compare(req.body.password, result[0].password, function(err, res2) {
                    if (err){
                      // handle error
                      console.log(err)
                    }
                    if (res2){
                    // console.log(result[0].email_id+" *** "+result[0].user_name)
                      req.session.email_id=result[0].email_id;
                      req.session.user_name=result[0].user_name;
                      if(result[0].type_id==1){
                          req.session.isAdmin=true;
                      }

                      console.log(req.session)
                    //   console.log(req.session.email_id+" : : "+req.session.user_name);
                      console.log('success')
                    //   res.render('/',{userId:req.session.userId, username:req.session.username});
                    
                    res.redirect('/');
                    } else {
                      // response is OutgoingMessage object that server response http request
                      req.flash('error_msg','Password you have entered is incorrect')
                      console.log('passwords do not match');
                      res.redirect('/login');
                    }
                  });
     
            }
        }
        else{
            console.log(err);
        }
    })
})

router.get("/login", redirectHome, function(req, res) {
    // console.log(req.session);
    res.render("customerSide/login",{email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart});
});

router.post("/register",redirectHome,async(req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password1, 5);
        user_model.addUser(req.body,hashedPassword, function(err, result) {
            if (!err) {
                // console.log("Number of records inserted: " + result.affectedRows); 
                req.flash('success_msg','You are now registered and can log in')
                res.redirect('/login');
            } else {
              if(err.code == 'ER_DUP_ENTRY')
                req.flash('error_msg','The email id you have entered is already registered.');
              // console.log(err);
              return res.redirect('/register');
                // console.log(err);
                // //alert(err); 
                // res.redirect("/register");
            }
        });

      } catch {
        res.redirect('/register');
      }
});
router.get("/register",redirectHome,function(req,res){
    res.render("customerSide/register",{email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin , cart:req.session.cart});
});

router.get('/logout',redirectLogin, (req, res) => {
    req.session.destroy(err=>{
        if(err){
            return res.redirect('/');
        }
        res.clearCookie(process.env.SESS_NAME)
        res.redirect('/login')
    })
  });


  router.get('/contact', (req, res) => {
        res.render('customerSide/contact',{email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin , cart:req.session.cart})
  })

  router.post('/login-driver', redirectHome, (req,res) =>{
    const{phone_number,password}=req.body

        driver_model.getDriverByPhoneNumber(phone_number, (err, result, fields) => {
        //    console.log("called");
        if (!err){
        // res.send(rows);
            if(result.length==0){
                // console.log("No such email id in database")
                req.flash('error_msg',"Phone number is invalid")
                res.redirect('/login-driver');
            }
            else{
                // console.log(result[0].password)
                //  console.log(result[Object.keys(result)[0]]);
                
                if(password==result[0].password){
                    req.session.driver_id=result[0].driver_id;
                    req.session.user_name=result[0].name;
                    console.log(req.session)
                    //   console.log(req.session.email_id+" : : "+req.session.user_name);
                      console.log('success')
                    //   res.render('/',{userId:req.session.userId, username:req.session.username});
                    
                    res.redirect('/driver-dash');
                }
                else {
                  // response is OutgoingMessage object that server response http request
                  req.flash('error_msg','Password is incorrect')
                  console.log('passwords do not match');
                  res.redirect('/login-driver');
                }
            }
        }
        else{
            console.log(err);
        }
    })
})

router.get("/login-driver", function(req, res) {
    // console.log(req.session);
    res.render("driverSide/driver-login");
});


router.get('/logout-driver',redirectDriverLogin, (req, res) => {
  req.session.destroy(err=>{
      if(err){
          return res.redirect('/login-driver');
      }
      res.clearCookie(process.env.SESS_NAME)
      res.redirect('/login-driver')
  })
});


router.post('/forgot-password',redirectHome,(req,res)=>{
  user_model.getUserByEmailId(req.body.email_id, async(err, result, fields) => {
    //    console.log("called");
    if (!err){
    // res.send(rows);
        if(result.length==0){
            // console.log("No such email id in database")
            req.flash('error_msg',"Email ID that you've entered isn't registered.")
            res.redirect('/forgot-password');
        }
        else{
            // console.log(result[0].password)
            //  console.log(result[Object.keys(result)[0]]);
            
            console.log(result[0].email_id+"***************************");

            var password = generator.generate({
              length: 8,
              numbers: true
            });

            try {
              const hashedPassword = await bcrypt.hash(password, 5);
              user_model.updatePwd(result[0].email_id, hashedPassword, async(err, result)=> {
                  if (!err) {
                      // create reusable transporter object using the default SMTP transport
                      // let transporter = nodemailer.createTransport({
                      //   host: "smtp.gmail.com",
                      //   port: 465,//587
                      //   secure: false, // true for 465, false for other ports
                      //   auth: {
                      //     user: "poonam.water.suppliers.reset@gmail.com", // generated ethereal user
                      //     pass: "pws_pass", // generated ethereal password
                      //   },
                      // });
                      // let smtpTransport = nodemailer.createTransport("SMTP",{
                      //   service: "Gmail",
                      //   auth: {
                      //       user: "poonam.water.suppliers.reset@gmail.com",
                      //       pass: "pws_pass"
                      //   }
                      // });
                      // // send mail with defined transport object
                      // let info = await transporter.sendMail({
                      //   from: '"Poonam Water Suppliers" <poonam.water.suppliers.reset@gmail.com>', // sender address
                      //   to: req.body.email_id, // list of receivers
                      //   subject: "Password has been changed", // Subject line
                      //   text: "Hello, your password has been set to "+password+". Please use this to login and change password.", // plain text body
                      //   // html: "<b>Hello world?</b>", // html body
                      // });

                      // console.log("Message sent: %s", info.messageId);
                      // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                      // // Preview only available when sending through an Ethereal account
                      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                      let transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: "poonam.water.suppliers.reset@gmail.com",
                            pass: "pws_pass"
                        },
                        tls:{
                          rejectUnauthorized:false
                        }
                      });
                    
                      // setup email data with unicode symbols
                      let mailOptions = {
                          from: 'Poonam Water Suppliers <poonam.water.suppliers.reset@gmail.com>', // sender address
                          to: req.body.email_id, // list of receivers
                          subject: "Password has been changed", // Subject line
                          text: "Hello, your password has been set to "+password+". Please use this to login and change password.", // plain text body
                          html: '' // html body
                      };
                    
                      // send mail with defined transport object
                      transporter.sendMail(mailOptions, (error, info) => {
                          if (error) {
                              return console.log(error);
                          }
                          console.log('Message sent: %s', info.messageId);   
                          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    
                          req.flash('success_msg','A random password has been mailed at your email id. Please use it to login to the website.');
                          res.redirect('/forgot-password');
                      });



                  } else {
                    req.flash('error_msg','Error:'+err);
                    res.redirect('/forgot-password');
                  }
              });
      
            } catch {
              req.flash('error_msg','Some error occured. Please try again.');
              return res.redirect('/forgot-password');
            }
 
        }
    }
    else{
        console.log(err);
    }
})
});

router.get('/forgot-password',redirectHome, (req,res)=>{
  res.render('customerSide/forgot-password')
});

  function redirectHome(req, res, next) {
    if (req.session.email_id) {
        // console.log(req.session.email_id+" : : "+req.session.user_name);
        return res.redirect('/');
    }
    next();    
  }


  function redirectLogin(req, res, next) {
    if (!req.session.email_id) {
        // console.log("user is authenticated.....%%%%%%%%%")
      return res.redirect('/login');
    }
    // console.log("user not authenticated.....%%%%%%%%%")
    next();
  }

  function redirectDriverLogin(req, res, next) {
    if (!req.session.driver_id) {
        // console.log("user is authenticated.....%%%%%%%%%")
      return res.redirect('/login-driver');
    }
    // console.log("user not authenticated.....%%%%%%%%%")
    next();
  }

  

  
  module.exports=router;