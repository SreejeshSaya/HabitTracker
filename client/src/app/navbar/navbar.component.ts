import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
   selector: 'app-navbar',
   templateUrl: './navbar.component.html',
   styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
   isLoading=true;
   isLoggedIn=false;
   constructor(public authService:AuthService) {

   }

   ngOnInit(): void {
      
   }
}
