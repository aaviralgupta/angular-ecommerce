import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPriceCart : number = 0.00;
  totalQuantityCart : number = 0;
  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    this.updateCartDetails();
  }

  updateCartDetails(){

    // subscribe to total quantity and price
    this.cartService.totalPrice.subscribe(
      data => this.totalPriceCart=data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantityCart=data
    );

  }


}
