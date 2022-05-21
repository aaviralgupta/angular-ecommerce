import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[]= [];

  totalPrice: Subject<number> = new Subject<number>();

  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){

    // check if we already have the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if(this.cartItems.length>0){
      // find the item in the cart based on id using Arrays.find method

      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);
      // check if we found it
      alreadyExistsInCart = (existingCartItem !=undefined);
    }

    if(alreadyExistsInCart){
      // increment the quantity
      existingCartItem!.quantity++;
    }

    else{
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for( let tempCartItem of this.cartItems){
      totalPriceValue += tempCartItem.quantity * tempCartItem.unitPrice;
      totalQuantityValue += tempCartItem.quantity;
    }

    // publish the new values for prices and quantity

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartDetails(totalPriceValue,totalQuantityValue);
  }

  logCartDetails(totalPriceValue: number, totalQuantityValue: number) {
    
    console.log('Cart subtotal details :');
    for(let tempCartItem of this.cartItems){
      console.log(`Product name:${tempCartItem.name}, quantity : ${tempCartItem.quantity}`
                  +`subtotal cart value : ${tempCartItem.quantity*tempCartItem.unitPrice}`);
    }

    console.log(`Total Quantity : ${totalQuantityValue}`);
    console.log(`Total Price : ${totalPriceValue}`);
  }

}

