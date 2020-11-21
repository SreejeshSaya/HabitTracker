import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
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

   onSubmit(loginForm: NgForm) {
      console.log(loginForm);
      console.log(loginForm.value)
      this.emailWarning = false;
      this.passwordWarning = false;

      this.authService.logIn(loginForm.value)
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
               loginForm.form.controls.email.setErrors({emailInvalid: true});
            }
            else if(msg === 'Invalid Password') {
               console.log(msg)
               this.warningMessage = msg;
               this.passwordWarning = true;
               loginForm.form.controls.password.setErrors({passwordInvalid: true});
            }
            else if(msg === 'Email Not Found') {
               this.warningMessage = 'No account exists';
               this.emailWarning = true;
               loginForm.form.controls.email.setErrors({emailNotFound: true});
            }
         }
      );
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
