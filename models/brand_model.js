var db=require('../dbconnec'); 
 
var brandProperties={
getBrands:function(callback){
return db.query("select * from brand_tbl",callback);
},
getBrandById:function(item,callback){
    return db.query("select * from brand_tbl where brand_id=?",[item.brand_id],callback);
},
addBrand:function(item,callback){
    return db.query("insert into brand_tbl(brand_name) values(?)",[item.brand_name],callback);
},
removeBrand:function(id,callback){
    return db.query("delete from brand_tbl where brand_id=?",[id],callback);
},
updateBrand:function(id,item,callback){
    return db.query("update brand_tbl set brand_name=? where brand_id=?",[item.brand_name,item.brand_id],callback);
}
};

module.exports=brandProperties;
