var db=require('../dbconnec'); 
 
var productProperties={
getProducts:function(callback){
return db.query("select * from product_tbl ",callback);
},
getProductByCategory:function(item,callback){
    return db.query("select * from product_tbl where fk_category_id=?",[item.categoryid],callback);
},
getProductByCapacity:function(item,callback){
    return db.query("select * from product_tbl where product_capacity=?",[item.capacity],callback);
},
getProductByPrice:function(item,callback){
    return db.query("select * from product_tbl where product_price>? AND product_price<?",[item.lowestprice,item.highestprice],callback);
},
addProduct:function(item,img_name,callback){
    return db.query("insert into product_tbl(product_name,product_image,product_description,product_price,product_qty,product_capacity,fk_brand_id,fk_category_id) values(?,?,?,?,?,?,?,?)",[item.product_name,img_name,item.product_description,item.product_price,item.product_qty,item.product_capacity,item.fk_brand_id,item.fk_category_id],callback);  //item.fk_brand_id,item.fk_category_id
},
removeProduct:function(id,callback){
    return db.query("delete from product_tbl where product_id=?",[id],callback);
},
getProductById:function(id,callback){
    return db.query("select * from product_tbl where product_id=?",[id],callback);
},
updateProduct:function(id,item,callback){
    return db.query("update product_tbl set product_name=?,product_image=?,product_description=?,product_price=?,product_qty=?,product_capacity=?,fk_brand_id=?,fk_category_id=? where product_id=?",[item.product_name,item.product_image,item.product_description,item.product_price,item.product_qty,item.product_capacity,item.fk_brand_id,item.fk_category_id,item.product_id],callback);
},
};

module.exports=productProperties;
