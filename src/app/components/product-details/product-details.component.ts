import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product : Product = new Product();
  productId: number;

  constructor(private productService:ProductService,
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

}
