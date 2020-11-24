var db=require('../dbconnec'); 
 
var driverProperties={
getDrivers:function(callback){
return db.query("select * from driver_tbl ",callback);
},
getDriverById:function(id,callback){
    return db.query("select * from driver_tbl where driver_id=?",[id],callback);
},
addDriver:function(item,callback){
    return db.query("insert into driver_tbl values(?,?,?,?)",[item.licenseno,item.name,item.mobile_no,item.address],callback);
},
removeDriver:function(id,callback){
    return db.query("delete from driver_tbl where mobile_no=?",[id],callback);
},
getDriverByPhoneNumber:function(id,callback){
    return db.query("select * from driver_tbl where mobile_no=?",[id],callback);
},
getAvailableDrivers:function(callback){
    return db.query("select * from driver_tbl where driver_status='available'",callback);
},
setDriverStatusAssigned:function(id,callback){
    return db.query("update driver_tbl set driver_status='assigned' where driver_id=?",[id],callback);
},
setDriverStatusAbsent:function(id,callback){
    return db.query("update driver_tbl set driver_status='absent' where driver_id=?",[id],callback);
},
setDriverStatusAvailable:function(id,callback){
    return db.query("update driver_tbl set driver_status='available' where driver_id=?",[id],callback);
},
updateDriver:function(id,item,callback){
    return db.query("update driver_tbl set licenseno=?,name=?,mobile_no=?,address=? where mobile_no=?",[item.licenseno,item.name,item.mobile_no,item.address,id],callback);
},
updatePwd:function(id,password,callback){
    return db.query("update driver_tbl set password=? where driver_id=?",[password,id],callback);
},
forgotPwd:function(id,callback){
    return db.query("select * from driver_tbl where email_id=?",[id],callback);
}
};

module.exports=driverProperties;
