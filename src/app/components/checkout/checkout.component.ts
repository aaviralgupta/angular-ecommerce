import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { FormValidators } from 'src/app/validators/form-validators';

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

  countries : Country[] = [];
  shippingStates : State[] = [];
  billingStates : State[] = [];

  constructor(private checkoutService : CheckoutService,
              private formService : FormService,
              private cartService : CartService,
              private formBuilder : FormBuilder,
              private router : Router) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2),
                                       FormValidators.notOnlyWhitespace]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2),
                                      FormValidators.notOnlyWhitespace]),
        email: new FormControl('',[Validators.required,
                                   Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                                   FormValidators.notOnlyWhitespace])
      }),
      shippingAddress: this.formBuilder.group({
        country : new FormControl('',[Validators.required]),
        street : new FormControl('',[Validators.required, Validators.minLength(2),
                                     FormValidators.notOnlyWhitespace]),
        city : new FormControl('',[Validators.required,Validators.minLength(2),
                                   FormValidators.notOnlyWhitespace]),
        state : new FormControl('',[Validators.required]),
        zipCode : new FormControl('',[Validators.required, Validators.minLength(2),
                                      FormValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country : new FormControl('',[Validators.required]),
        street : new FormControl('',[Validators.required, Validators.minLength(2),
                                     FormValidators.notOnlyWhitespace]),
        city : new FormControl('',[Validators.required, Validators.minLength(2),
                                   FormValidators.notOnlyWhitespace]),
        state : new FormControl('',[Validators.required]),
        zipCode : new FormControl('',[Validators.required, Validators.minLength(2),
                                      FormValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType : new FormControl('',[Validators.required]),
        nameOnCard : new FormControl('',[Validators.required,FormValidators.notOnlyWhitespace,
                                         Validators.minLength(2)]),
        cardNumber : new FormControl('',[Validators.required,
                                         Validators.pattern('[0-9]{16}')]),
        securityCode : new FormControl('',[Validators.required,
                                           Validators.pattern('[0-9]{3}')]),
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
  
  this.getCounties();

  this.updateCartDetails();

  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardName(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}
  

  onSubmit(){
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice=this.totalPrice;
    order.totalQuantity=this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;
    // create orderItems and cartItems
    let orderItems : OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem)); 

    // set up purchase
    let purchase = new Purchase();
    // populate Purchase

    purchase.customer=this.checkoutFormGroup.controls['customer'].value;
    purchase.order=order;
    purchase.orderItems=orderItems;

    // shpping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState : State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry : Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state= shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;


    // biilling address

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState : State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry : Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state= billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // call checkoutservice
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          alert(`Your order has been placed.\nOrder tracking number : ${response.orderTrackingNumber}`);
          
          // reset cart
          this.resetCart();
       },
        error: err=>{
          alert(`There was an error: ${err.message}`);
        }
      }
    );
    
  }
  resetCart() {
    // reset cart data

    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset form data

    this.checkoutFormGroup.reset();

    // navigate back to product page
    this.router.navigateByUrl("/products");
  }

  getCounties(){
    this.formService.getAddressCountries().subscribe(
      data => this.countries=data
    );
  }

  copyShippingAddressToBiilingAddress(event: any){
    if(event.target.checked){
      //console.log(JSON.stringify(this.checkoutFormGroup.controls['shippingAddress'].value));
      
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingStates=this.shippingStates;
      //this.checkoutFormGroup.controls['billingAddress'].disable;

    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingStates =[];
    }
  }

  changeMonthsWithYear(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();
    const selectedYear : number = Number(creditCardFormGroup?.get('expirationYear'));

    let startMonth : number = 1;
    if(currentYear != selectedYear){
      this.formService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("Retrieved credit card months: " +JSON.stringify(data));
          this.creditCardMonths=data;
      });

    }
    else{
      startMonth = new Date().getMonth() + 1;
      this.formService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("Retrieved credit card months: " +JSON.stringify(data));
          this.creditCardMonths=data;
      });
    }
    
  }


  changeStateWithCountry(formGroupName :string){

    const theFormGroup = this.checkoutFormGroup.get(formGroupName);
    const country : Country = theFormGroup?.value.country;
    console.log('selected country : ' + country.code);

    //let selectedCountry : Country= theFormGroup?.get('country');

    if(formGroupName === 'shippingAddress'){
      this.formService.getAddressStates(country).subscribe(
        data => this.shippingStates=data
      );
    }
    else if(formGroupName === 'billingAddress'){
      this.formService.getAddressStates(country).subscribe(
        data => this.billingStates=data
      );
    } 
  }


  updateCartDetails(){

    // subscribe to total quantity and price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice=data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity=data
    );

  }
}
