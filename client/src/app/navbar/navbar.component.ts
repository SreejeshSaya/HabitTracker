import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
   selector: 'app-navbar',
   templateUrl: './navbar.component.html',
   styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
   isLoading=true;
   isLoggedIn=true; //Need to work on this
   @Output() toggleSideBar = new EventEmitter();
   constructor(public authService:AuthService) {

   }

   ngOnInit(): void {
      
   }
   sideBarToggle() {
      this.toggleSideBar.emit();
      console.log("Button clicked");
   }
}
