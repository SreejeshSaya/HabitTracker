import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HabitService } from '../habit.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
   routeSub;
   authSub;
   bestStreak=0;
   habitScore=0;
   constructor(public authService: AuthService, private router: Router, public habitService: HabitService, route: ActivatedRoute) {
      this.routeSub = route.params.subscribe(val => {
         if (!this.authService.userDetails) {
            this.authService.getUserDetails();
         }
      });
   }

   ngOnInit(): void {
      this.authSub = this.authService.isLoading$.pipe(map(l => {
         if (!l && this.authService.userDetails) {
            return true
         } else if (!l) {
            this.router.navigateByUrl('/login');
         }
         else {
            return false;
         }
      }),filter(l=>l),switchMap(_=>{
         return this.habitService.isLoading$
      }))
      .subscribe(l=>{
         if (!l && this.habitService.userHabits) {
            // this.userHabits = this.habitService.userHabits
            console.log(this.habitService.userHabits)
            this.updateStats()
         } else if (!l) {
            this.router.navigateByUrl('/');
         }
      });
   }
   updateStats(){
      for (let h of this.habitService.userHabits){
         if (h.streak>this.bestStreak){
            this.bestStreak = h.streak
         }
         this.habitScore+=h.streak;//needs improvement
      }

   }
   ngOnDestroy(){
      this.authSub.unsubscribe();
      this.routeSub.unsubscribe();
   }

}
