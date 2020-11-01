import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

   onSubmit() {
      this.usernameWarning = false;
      this.emailWarning = false;
      this.passwordWarning = false;
      if(this.username === '') {
         this.warningMessage = '* Username Required';
         this.usernameWarning = true;
      }
      else if(this.email === '') {
         this.warningMessage = '* Email Required';
         this.emailWarning = true;
      }
      else if (this.password === '') {
         this.warningMessage = '* Password Required';
         this.passwordWarning = true;
      }
      else {
         this.authService.signUp(this.username, this.password, this.email)
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
                  }
                  if(msg === 'Username Exists!') {
                     alert(`An Account already exists with username: ${this.username}`);
                  }
                  else if(msg === 'Email Invalid') {
                     this.warningMessage = msg;
                     this.emailWarning = true;
                  }
                  else if(msg === 'Email Exists!') {
                     alert(`An Account already exists with username: ${this.email}`);
                  }
                  // alert(err);
               }
            );
      }
   }

   ngOnDestroy(){
      this.routeSub.unsubscribe()
      this.authSub.unsubscribe()
   }
}
