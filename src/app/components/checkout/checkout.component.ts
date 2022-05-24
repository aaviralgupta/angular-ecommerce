import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup : FormGroup;
  totalPrice : number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formService : FormService,
              private cartService : CartService,
              private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country : [''],
        street : [''],
        city : [''],
        state : [''],
        zipCode : ['']
      }),
      billingAddress: this.formBuilder.group({
        country : [''],
        street : [''],
        city : [''],
        state : [''],
        zipCode : ['']
      }),
      creditCard: this.formBuilder.group({
        cardType : [''],
        nameOnCard : [''],
        cardNumber : [''],
        securityCode : [''],
        expirationMonth : [''],
        expirationYear : ['']
      })
    });

  // populate credit card months and years

  const startMonth: number = new Date().getMonth() +1;
  console.log("startMonths : "+ startMonth);

  this.formService.getCreditCardMonths(startMonth).subscribe(
    data =>{
      console.log("Retrieved credit card months: " +JSON.stringify(data));
      this.creditCardMonths=data;
    }
  );

  this.formService.getCreditCardYears().subscribe(
    data =>{
      console.log("Retrieved credit card years: " +JSON.stringify(data));
      this.creditCardYears=data;
    }
  );


  }

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  copyShippingAddressToBiilingAddress(event: any){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      )
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
}
