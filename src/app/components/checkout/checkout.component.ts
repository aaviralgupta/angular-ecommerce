import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
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

  countries : Country[] = [];
  shippingStates : State[] = [];
  billingStates : State[] = [];

  constructor(private formService : FormService,
              private cartService : CartService,
              private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2)]),
        email: new FormControl('',
        [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
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
  
  this.getCounties();

  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  onSubmit(){
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
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
}
