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
  currentCategoryId : number = 1;
  previousCategoryId: number = 1;
  currentCategoryName : string | null;
  searchFlag : boolean;
  searchText: string | null;

  //new properties for pagination
  thePageNumber: number=1;
  thePageSize: number=5;
  theTotalElements: number=0;
  
  constructor(private productService:ProductService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
      this.listProducts();
    });
  }

  listProducts(){
    this.searchFlag=this.route.snapshot.paramMap.has('searchText');
    console.log("searchFlag"+ false);
    if(this.searchFlag){
      this.searchText=this.route.snapshot.paramMap.get('searchText');
      this.handleSearchProduct(this.searchText);
    }
    else{
      this.handlelistProducts();
    }
  }
  handleSearchProduct(searchText: string | null) {

    this.productService.searchProducts(searchText).subscribe(
      data=> {
        this.products=data;
      }
    );

    
  }
  handlelistProducts(){

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


    //Check if we havr a different category then previous
    // Note: Angular will reuse a component if it is currently being viewed

    // if we have different category id then previous then 
    // reseting thePageNumber to 1

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }

    this.previousCategoryId=this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumner=${this.thePageNumber}`)

    // get the productsfor the given category id
    this.productService.getProductListPaginate(this.thePageNumber -1,this.thePageSize,this.currentCategoryId)
                       .subscribe(data => {
                        this.products = data._embedded.products;
                        this.thePageNumber = data.page.number + 1;
                        this.thePageSize = data.page.size;
                        this.theTotalElements = data.page.totalElements;
                      });
  }

  updatePageSize(pageSize: number){
    this.thePageSize=pageSize;
    this.thePageNumber=1;
    this.listProducts();
  }
}
