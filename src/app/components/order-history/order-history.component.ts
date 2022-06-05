import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList : OrderHistory[] = [];

  storage : Storage = sessionStorage;
  constructor(private orderService : OrderService) {}

  ngOnInit(): void {
    this.handleOrderHistory();
    //console.log(this.orderHistoryList[0].orderTrackingNumber);
  }

  handleOrderHistory() {
    
    const theEmail = this.storage.getItem('userEmail');
    //console.log(theEmail);
    this.orderService.getOrderHistory(theEmail).subscribe(

      data => {
        this.orderHistoryList = data._embedded.orders;
        //console.log(JSON.stringify(this.orderHistoryList));
      }
    );
  }

}
