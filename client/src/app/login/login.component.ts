import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
   email: string;
   emailWarning: boolean;
   password: string;
   warningMessage: string;
   passwordWarning: boolean;
   isLoading = true;
   routeSub;
   authSub;
   constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) {
      this.password = '';
      this.email = '';
      this.emailWarning = false;
      this.passwordWarning = false;
      this.warningMessage = '';
      this.routeSub = route.params.subscribe(val => {
         if (!this.authService.userDetails) {
            this.authService.getUserDetails();
         }
      });
   }

   ngOnInit(): void {
      this.authSub = this.authService.isLoading$.subscribe(l => {
         if (!l && this.authService.userDetails) {
            this.router.navigateByUrl("/")
         }
         else if (!l){
            this.isLoading = false
         }
      })
   }

   onSubmit() {
      this.emailWarning = false;
      this.passwordWarning = false;
      if(this.email === '') {
         this.warningMessage = '* Email Required';
         this.emailWarning = true;
      }
      else if (this.password === '') {
         this.warningMessage = '* Password Required';
         this.passwordWarning = true;
      }
      else {
         this.authService.logIn(this.email, this.password)
         .subscribe(
            (data) => {
               console.log(data);
               if (data === 'Ok') {
                  this.isLoading = true;
                  // this.emailWarning = false;
                  // this.passwordWarning = false;
                  console.log('login will redirect');
                  this.router.navigateByUrl('/');
               }
            },
            (err) => {
               console.log('Loggin Error')
               console.log(err);
               let msg: string;
               msg = err.error;
               if(msg === 'Email Invalid!') {
                  this.warningMessage = msg;
                  this.emailWarning = true;
               }
               else if(msg === 'Invalid Password') {
                  this.warningMessage = msg;
                  this.passwordWarning = true;
               }
               else if(msg === 'Email Not Found') {
                  this.warningMessage = 'No account exists';
                  this.emailWarning = true;
                  // alert(`No Account exists with the email id: ${this.email}`)
               }
            }
         );
      }
   }

   // loginDisabled() {
   //    if(this.email === '' || this.password === '')
   //       return false;
   //    return true;
   // }

   ngOnDestroy(){
      this.routeSub.unsubscribe()
      this.authSub.unsubscribe()
   }

}
