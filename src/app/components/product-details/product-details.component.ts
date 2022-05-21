import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product : Product = new Product();
  productId: number;
  cartItem : CartItem;

  constructor(private cartService : CartService,
              private productService:ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
      this.getProductDetails();
    });
  }

  getProductDetails() {

    this.productId= Number(this.route.snapshot.paramMap.get('id'));
    console.log("product id:"+this.productId);

    this.productService.getProductDetails(this.productId).subscribe(
      data=> {
        this.product=data;
      }
    );
  }

  addToCart(product : Product){
    console.log(`Adding to cart: ${product.name}, ${product.id}`);
    this.cartItem = new CartItem(product);

    this.cartService.addToCart(this.cartItem);
  }


}
