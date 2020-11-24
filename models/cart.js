module.exports=function Cart(oldCart){
    this.items=oldCart.items || {};
    this.totalQty=oldCart.totalQty || 0;
    this.totalPrice=oldCart.totalPrice || 0;

    this.add=function(item, id){
        let storedItem=this.items[id];
        if(!storedItem){
            storedItem=this.items[id]={item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price=storedItem.item.product_price*storedItem.qty;
        this.totalQty++;
        this.totalPrice+=storedItem.item.product_price;
    };

    this.addMultiple=function(item,id,n){
        let storedItem=this.items[id];
        if(!storedItem){
            storedItem=this.items[id]={item: item, qty: 0, price: 0};
        }
        storedItem.qty+=Number(n);
        storedItem.price=storedItem.item.product_price*storedItem.qty;
        this.totalQty+=Number(n);
        this.totalPrice+=(storedItem.item.product_price*Number(n));
    }

    this.removeOne=function(id){
        let storedItem=this.items[id];
        if(storedItem){
            storedItem.qty--;
            storedItem.price=storedItem.price-storedItem.item.product_price;
            
            this.totalQty--;
            this.totalPrice-=storedItem.item.product_price;

            if(storedItem.qty ==0){
                // console.log("qty is 0 Deleetingggg*******************************************")
                delete this.items[id];
            }
        }
    };

    this.removeAll=function(id){
        let storedItem=this.items[id];
        if(storedItem){
            this.totalQty-=storedItem.qty;
            this.totalPrice-=storedItem.price;
                // console.log("qty is 0 Deleetingggg*******************************************")
            storedItem.qty=0;
            if(storedItem.qty ==0){
                delete this.items[id];
            }
        }
    };

    this.generateArray=function(){
        let arr=[];
        for(let id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};