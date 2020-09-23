import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { HabitService } from 'src/app/habit.service';
import { concatMap, tap, map, filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { getDateString,getHistory } from 'src/app/dateManager'
import {colors} from 'src/app/colors'

@Component({
   selector: 'app-habit-manage',
   templateUrl: './habit-manage.component.html',
   styleUrls: ['./habit-manage.component.css'],
})
export class HabitManageComponent implements OnInit {
   habit;
   habitId;
   routeSub;
   authSub;
   history;
   text;
   endDate;
   selectedColor;
   colors;
   constructor(
      public router: Router,
      public route: ActivatedRoute,
      public authService: AuthService,
      public habitService: HabitService
   ) {
      this.routeSub = route.params.subscribe(val => {
         this.habitId = +val['habitId']
         if (!this.authService.userDetails) {
            this.authService.getUserDetails();
         }
      });
      this.colors =colors
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
         if (!l && this.habitService.userHabits && this.habitService.userHabits[this.habitId]) {
            this.habit = this.habitService.userHabits[this.habitId]
            this.text = this.habit.text
            this.endDate = getDateString(this.habit.endDate)
            this.history = getHistory(this.habit.createdAt,this.habit.history)
            this.selectedColor = this.habit.color
         } else if (!l) {
            this.router.navigateByUrl('/');
         }
      });
   }

   updateHabit(){
      this.habitService.updateHabit(this.habit.index,this.text,this.selectedColor,this.endDate)
      .subscribe(d=>{
         this.router.navigateByUrl("/")
      })
   }

   ngOnDestroy() {
      this.routeSub.unsubscribe();
      this.authSub.unsubscribe();
   }

   deleteHabit(){
      this.habitService.deleteHabit(this.habit.index)
      .subscribe(d=>{
         this.router.navigateByUrl("/")
      })
   }
   colorChange(color){
      this.selectedColor = color 
   }
}
