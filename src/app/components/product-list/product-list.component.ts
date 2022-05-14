import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId : number;
  currentCategoryName : string | null;
  constructor(private productService:ProductService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
      this.listProducts();
    });
  }

  listProducts(){

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      const id = this.route.snapshot.paramMap.get('id');
      // get the "id" param as string and convert it using + symbol to number
      this.currentCategoryId = Number(id);
      this.currentCategoryName= this.route.snapshot.paramMap.get('name');
    }
    else{
      // not category id available... default to category id 1
      this.currentCategoryId =1; 
      this.currentCategoryName = 'Books';
    }

    // get the productsfor the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data=> {
        this.products=data;
      }
    );
  }

}
