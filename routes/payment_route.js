const express=require('express');
const flash = require('express-flash');
const session = require('express-session');
const router=express.Router({mergeParams:true});
let Cart=require('../models/cart');
const user_model=require('../models/user_model.js');
const order_model=require('../models/order_model.js');

const checksum_lib = require('../paytm/checksum/checksum')
const port = 3010



router.get('/checkout', redirectLogin,(req,res)=>{
    user_model.getUserByEmailId(req.session.email_id, (err, result, fields) => {
        //    console.log("called");
        if (!err){
            // res.send(rows);
            let cart=new Cart(req.session.cart);
            res.render("customerSide/checkout",{user:result[0],email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart, cartItems:cart.generateArray().length>0 ? cart.generateArray() : null, totalPrice:cart.totalPrice});
        }
        else{
            console.log(err);
        }
    })
})

router.post('/confirmation', redirectLogin,(req,res)=>{
    let stringifiedCart = JSON.stringify(req.session.cart);
    console.log(stringifiedCart)
    order_model.addOrder(req.body,stringifiedCart,(err, result)=>{
        if (!err){
            // res.send(rows);
            order_model.getLatestOrderForUser(req.session.email_id,(err,result)=>{
                if(!err){
                    req.session.cart=undefined;
                    req.flash('success_msg','Thank you. Your order has been received.')
                    return res.redirect('/orders/'+result[0].order_id);
                }
                else{
                    req.flash('error_msg',err.code);
                    return res.redirect('/');
                }    
            })

            }
        else{
            req.flash('error_msg',err.code);
            console.log(err);
            return res.redirect('/checkout');
        }
    })
    // user_model.getUserByEmailId(req.session.email_id, (err, result, fields) => {
    //     //    console.log("called");
    //     if (!err){
    //         // res.send(rows);
    //         let cart=new Cart(req.session.cart);
    //         res.render("customerSide/checkout",{user:result[0],email_id:req.session.email_id, user_name:req.session.user_name, isAdmin: req.session.isAdmin, cart:req.session.cart, cartItems:cart.generateArray().length>0 ? cart.generateArray() : null, totalPrice:cart.totalPrice});
    //     }
    //     else{
    //         console.log(err);
    //     }
    // })
})

router.get('/payment',(req,res)=>{
    let params ={}
    params['MID'] = 'CnrONZ68920148498573',
    params['WEBSITE'] = 'WEBSTAGING',
    params['CHANNEL_ID'] = 'WEB',
    params['INDUSTRY_TYPE_ID'] = 'Retail',
    params['ORDER_ID'] = 'ORD0001',
    params['CUST_ID'] = 'CUST0011',
    params['TXN_AMOUNT'] = '100',
    params['CALLBACK_URL'] = 'http://localhost:'+port+'/',
    params['EMAIL'] = 'meetjshah82@gmail.com',
    params['MOBILE_NO'] = '8000161298'

    checksum_lib.genchecksum(params,'w%zvxO2k%fTjZiEr',function(err,checksum){
        let txn_url = "https://securegw-stage.paytm.in/order/process"

        let form_fields = ""
        for(x in params)
        {
            form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"'/>"

        }

        form_fields+="<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' />"

        var html = '<html><body><center><h1>Please wait! Do not refresh the page</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields +'</form><script type="text/javascript">document.f1.submit()</script></body></html>'
        res.writeHead(200,{'Content-Type' : 'text/html'})
        res.write(html)
        res.end()
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