import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {concatMap } from 'rxjs/operators';
import { HabitService } from '../habit.service';

@Component({
   selector: 'app-pending',
   templateUrl: './pending.component.html',
   styleUrls: ['./pending.component.css'],
})
export class PendingComponent implements OnInit {
   addText;
   authSub;
   routeSub;
   constructor(public authService: AuthService, private router: Router, public habitService: HabitService, route: ActivatedRoute) {
      this.routeSub = route.params.subscribe(val => {
         if (!this.authService.userDetails) {
            this.authService.getUserDetails();
         }
      });
   }

   ngOnInit(): void {
      console.log('calling init');
      this.authSub = this.authService.isLoading$
      .subscribe(l => {
         console.log('pending', l, this.authService.userDetails);
         if (!l && !this.authService.userDetails){
            console.log('going back');
            this.router.navigateByUrl('/login');
         }
      });
   }

   addHabit(){
      this.habitService.addHabit(this.addText).subscribe(a => {
         console.log(a);
      });
   }

   removeHabit(i){
      this.habitService.removeHabit(i).subscribe(data => {

      });
   }
   ngOnDestroy(){
      this.authSub.unsubscribe();
      this.routeSub.unsubscribe();
   }
}
