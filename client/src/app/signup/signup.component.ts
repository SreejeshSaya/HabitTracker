import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
   constructor(private authService: AuthService, private router: Router) {}

   ngOnInit(): void {}

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
}
