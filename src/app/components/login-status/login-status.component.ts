import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string;

  storage: Storage = sessionStorage;
  
  constructor(private oktaAuthService : OktaAuthService) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );
  }
  getUserDetails() {
    
    if( this.isAuthenticated){

      // Fetch the logged in user details
      this.oktaAuthService.getUser().then(
        (res) => {
          this.userFullName = res.name;
          console.log(res.email);
          this.storage.setItem('userEmail', res.email);
        }
      );
    }
  }

  logout() {

    // terminate the session with Okta and remove current tokens
    this.oktaAuthService.signOut();
    sessionStorage.clear();
  }

}
