import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
   selector: 'app-signup',
   templateUrl: './signup.component.html',
   styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
   username;
   email;
   password;
   routeSub;
   authSub;
   isLoading=true;
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
            this.isLoading=false
         }
      })
   }

   onSubmit() {
      this.authService
         .signUp(this.username, this.password, this.email)
         .subscribe(
            (data) => {
               if (data == 'Ok') {
                  this.router.navigateByUrl('/');
               }
            },
            (err) => {
               console.log(err);
               alert(err);
            }
         );
   }

   ngOnDestroy(){
      this.routeSub.unsubscribe()
      this.authSub.unsubscribe()
   }
}
