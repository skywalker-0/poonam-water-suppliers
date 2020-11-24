var db=require('../dbconnec'); 
 
function pad2(number, length=2) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

var orderProperties={
getOrders:function(callback){
return db.query("select * from order_tbl ",callback);
},
getPendingOrdersForToday:function(callback){
    let dt = new Date();
    let dtstring = dt.getFullYear()
    + '-' + pad2(dt.getMonth()+1)
    + '-' + pad2(dt.getDate());
    return db.query("select * from order_tbl join user_tbl on order_tbl.fk_email_id = user_tbl.email_id where order_status IN ('Pending','Pending (Repeating)') and order_delivery_date=?",[dtstring],callback);
},
getMissedPendingOrders:function(callback){
    let dt = new Date();
    let dtstring = dt.getFullYear()
    + '-' + pad2(dt.getMonth()+1)
    + '-' + pad2(dt.getDate());
    return db.query("select * from order_tbl join user_tbl on order_tbl.fk_email_id = user_tbl.email_id where order_status IN ('Pending','Pending (Repeating)')  and order_delivery_date<?",[dtstring],callback);
},
getAssignedOrders:function(callback){
    return db.query("select * from order_tbl join user_tbl on order_tbl.fk_email_id = user_tbl.email_id where order_status='Out for delivery'",callback);
},
getDeliveredOrders:function(callback){
    return db.query("select * from order_tbl join user_tbl on order_tbl.fk_email_id = user_tbl.email_id where order_status='Delivered'",callback);
},

getLatestOrderForUser:function(email,callback){
    return db.query("SELECT * FROM order_tbl WHERE order_id IN (SELECT order_id FROM order_tbl WHERE order_date = (SELECT MAX(order_date) FROM order_tbl) and fk_email_id=?) ORDER BY order_id DESC LIMIT 1",[email],callback);
},
getOrdersByEmail:function(email,callback){
    return db.query("select * from order_tbl where fk_email_id=?",[email],callback);
},
setAssignedDriverToOrder:function(o_id,d_id,callback){
    return db.query("update order_tbl set fk_driver_assigned=?, order_status='Out for delivery' where order_id=?;",[d_id,o_id],callback);
},
getOrderByDriver:function(d_id,callback){
    return db.query("select * from order_tbl where fk_driver_assigned=?",[d_id],callback);
},
setOrderStatusDelivered:function(o_id,callback){
    return db.query("update order_tbl set fk_driver_assigned=0, order_status='Delivered' where order_id=?;",[o_id],callback);
},
setOrderStatusCancelled:function(o_id,callback){
    return db.query("update order_tbl set fk_driver_assigned=0, order_status='Cancelled' where order_id=?;",[o_id],callback);
},
setNextOrderDate:function(o_id,days, callback){
    return db.query("update order_tbl set order_delivery_date=ADDDATE(order_delivery_date,INTERVAL ? DAY), order_status='Pending (Repeating)' where order_id=?;",[days,o_id],callback);
    // UPDATE credit SET addOns=ADDDATE(addOns, INTERVAL 30 DAY)
},
addOrder:function(item,stringifiedCart,callback){
    // var dt = new Date();
    // var dtstring = dt.getFullYear()
    // + '-' + pad2(dt.getMonth()+1)
    // + '-' + pad2(dt.getDate())
    // + ' ' + pad2(dt.getHours())
    // + ':' + pad2(dt.getMinutes())
    // + ':' + pad2(dt.getSeconds());
    // console.log(item.order_repeat+"******************");
    if(item.order_repeat==0){
        return db.query("insert into order_tbl(order_amount,order_items,order_delivery_date,order_shipping_address,order_payment_mode,fk_email_id,order_mobile_no,order_repeat) values(?,?,?,?,?,?,?,?)",
        [item.order_amount,stringifiedCart,item.delivery_date,item.address,item.chkPayment,item.email,item.mobile_no,-1],callback);
    }
    else{
        return db.query("insert into order_tbl(order_amount,order_items,order_delivery_date,order_shipping_address,order_payment_mode,fk_email_id,order_mobile_no,order_repeat) values(?,?,?,?,?,?,?,?)",
        [item.order_amount,stringifiedCart,item.delivery_date,item.address,item.chkPayment,item.email,item.mobile_no,item.order_repeat],callback);
    }
},
removeOrder:function(id,callback){
    return db.query("delete from order_tbl where order_id=?",[id],callback);
},
getOrderById:function(id,callback){
    return db.query("select * from order_tbl where order_id=?",[id],callback);
},
// updateProduct:function(id,item,callback){
//     return db.query("update order_tbl set product_name=?,product_image=?,product_description=?,product_price=?,product_qty=?,product_capacity=?,fk_brand_id=?,fk_category_id=? where product_id=?",[item.product_name,item.product_image,item.product_description,item.product_price,item.product_qty,item.product_capacity,item.fk_brand_id,item.fk_category_id,item.product_id],callback);
// },
};

module.exports=orderProperties;