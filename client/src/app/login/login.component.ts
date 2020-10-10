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
   email = '';
   emailMessage = '';
   emailWarning = false;
   password = '';
   passwordMessage = '';
   passwordWarning= false;
   isLoading = true;
   routeSub;
   authSub;
   constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) {
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
      if(this.email === '') {
         this.emailMessage = 'Email Field Required';
         this.emailWarning = true;
      }
      else if (this.password === '') {
         this.passwordMessage = 'Password Field Required';
         this.passwordWarning = true;
      }
      else {
         this.isLoading = true;
         this.emailWarning = false;
         this.passwordWarning = false;
         this.authService.logIn(this.email, this.password).subscribe(
            (data) => {
               console.log(data);
               if (data === 'Ok') {
                  console.log('login will redirect');
                  this.router.navigateByUrl('/');
               }
               else {
                  // invalid login
                  if(data === 'Invalid Password') {
                     this.passwordMessage = 'Invalid Password';
                     this.passwordWarning = true;
                  }
                  else if(data === 'Email Not Found') {
                     this.emailMessage = 'Invalid email';
                     this.emailWarning = true;
                  }
               }
            },

            (err) => {
               console.log('Loggin Error')
               console.log(err);
               alert(err);
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
