var db=require('../dbconnec'); 
 
var userProperties={
getUser:function(callback){
return db.query("select * from user_tbl ",callback);
},
getCustomers:function(callback){
    return db.query("select * from user_tbl where type_id=3",callback);
},
getUserById:function(item,callback){
    return db.query("select * from user_tbl where email_id=? and password=?",[item.email_id,item.password],callback);
},
addUser:function(item,hashedPassword,callback){
    return db.query("insert into user_tbl values(?,?,?,?,?,?)",[item.email_id,hashedPassword,item.username,item.mob_no,item.address,3],callback);
},
addAdmin:function(item,callback){
    return db.query("insert into user_tbl values(?,?,?,?)",[item.email_id,item.password,item.user_name,item.mobile_no,item.address,1],callback);
},

removeUser:function(id,callback){
    return db.query("delete from user_tbl where email_id=?",[id],callback);
},
getUserByEmailId:function(id,callback){
    return db.query("select * from user_tbl where email_id=?",[id],callback);
},
updateUser:function(id,item,callback){
    return db.query("update user_tbl set email_id=?,user_name=?,mobile_no=?,address=? where email_id=?",[item.email_id,item.user_name,item.mobile_no,item.address,id],callback);
},
updatePwd:function(id,password,callback){
    return db.query("update user_tbl set password=? where email_id=?",[password,id],callback);
},
forgotPwd:function(id,callback){
    return db.query("select * from user_tbl where email_id=?",[id],callback);
}
};

module.exports=userProperties;
