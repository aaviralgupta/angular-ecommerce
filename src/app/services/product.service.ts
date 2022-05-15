import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl ='http://localhost:8081/api/products';
  private categoryUrl ='http://localhost:8081/api/product-category';
  
  constructor(private httpClient: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory));
    
  }

  getProductList(theCategoryId: number): Observable<Product[]>{
   
    // need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }
  

  searchProducts(searchText: string | null): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${searchText}`;
    
    return this.getProducts(searchUrl);
  
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products));
  }

  getProductDetails(productId: number): Observable<Product> {

    const productUrl = `${this.baseUrl}/${productId}`;
    
    return this.httpClient.get<Product>(productUrl);
    
  }
}

interface GetResponseProducts{
  _embedded:{
    products: Product[];
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}
