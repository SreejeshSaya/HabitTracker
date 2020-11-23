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
   dateJoined;
   dateJoinedYear;
   averageCompletionDelay;
   sdata;
   pdata;
   constructor(public authService: AuthService, private router: Router, public habitService: HabitService, route: ActivatedRoute) {
      this.routeSub = route.params.subscribe(val => {
         this.authService.getUserDetails();
         
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
      this.bestStreak = this.authService.userDetails.bestStreak
      this.habitScore = this.authService.userDetails.habitScore
      this.averageCompletionDelay = this.authService.userDetails.averageCompletionDelay
      console.log(this.authService.userDetails.habitScore)
      this.dateJoined = new Date(this.authService.userDetails.createdAt)
      this.dateJoinedYear = this.dateJoined.getFullYear()
      this.dateJoined = this.dateJoined.toDateString().slice(4);
      this.sdata = this.authService.userDetails.streakHistory.map(h=>{return {date: new Date(h.date),value: h.streak, habitText: h.habitText}})
      this.pdata = this.authService.userDetails.punctualityHistory.map(h=>{return {date: new Date(h.date),value: h.punctuality,changeCnt:h.changeCnt}})
      console.log(this.sdata,this.pdata)
   }

   ngOnDestroy(){
      this.authSub.unsubscribe();
      this.routeSub.unsubscribe();
   }

}
