import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
   selector: 'app-signup',
   templateUrl: './signup.component.html',
   styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
   username: string;
   usernameWarning: boolean;
   email: string;
   emailWarning: boolean;
   password: string;
   passwordWarning: boolean;
   warningMessage: string;
   routeSub;
   authSub;
   isLoading=true;
   constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) {
      this.username = '';
      this.email = '';
      this.password = '';

      this.usernameWarning = false;
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
            this.isLoading=false
         }
      })
   }

   onSubmit(signupForm: NgForm) {
      this.usernameWarning = false;
      this.emailWarning = false;
      this.passwordWarning = false;
      console.log(signupForm)
      console.log(signupForm.value)
      this.authService.signUp(signupForm.value)
         .subscribe(
            (data) => {
               if (data == 'Ok') {
                  this.router.navigateByUrl('/');
               }
            },
            (err) => {
               // console.log(err);
               let msg: string;
               msg = err.error;
               if((msg === 'Username Invalid') || (msg === 'Username too long!')) {
                  this.warningMessage = msg;
                  this.usernameWarning = true;
                  signupForm.form.controls.username.setErrors({usernameInvalid: true});
               }
               if(msg === 'Username Exists!') {
                  this.warningMessage = msg;
                  this.usernameWarning = true;
                  signupForm.form.controls.username.setErrors({usernameExists: true});
               }
               else if(msg === 'Email Invalid') {
                  this.warningMessage = msg;
                  this.emailWarning = true;
                  signupForm.form.controls.email.setErrors({emailInvalid: true});
               }
               else if(msg === 'Email Exists!') {
                  this.warningMessage = msg;
                  this.emailWarning = true;
                  signupForm.form.controls.email.setErrors({emailInvalid: true});
               }
            }
         );
   }

   ngOnDestroy(){
      this.routeSub.unsubscribe()
      this.authSub.unsubscribe()
   }
}
