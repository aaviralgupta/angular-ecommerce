import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderUrl : string = 'http://localhost:8081/api/orders';

  constructor(private httpClient : HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory>{

    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${theEmail}`;

    //console.log(orderHistoryUrl);
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}

interface GetResponseOrderHistory{
  _embedded:{
    orders : OrderHistory[];
  }
}
