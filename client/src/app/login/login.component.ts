import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
   email;
   password;
   isLoading = false;
   constructor(private authService: AuthService, private router: Router) {}

   ngOnInit(): void {}

   onSubmit() {
      this.isLoading = true;
      this.authService.logIn(this.email, this.password).subscribe(
         (data) => {
            console.log(data);
            if (data == 'Ok') {
               console.log('login will redirect');
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
