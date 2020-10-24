import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { HabitService } from 'src/app/habit.service';
import { StreakCalendarComponent } from 'src/app/streak-calendar/streak-calendar.component';
import { concatMap, tap, map, filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { getDateString,getHistory, removeTime } from 'src/app/dateManager'
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
   histStreak = [];
   message = "test";
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
            this.createStreakCalendar();
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

   createStreakCalendar() {
      let monthStreak = [];
      const l = this.history.length-1;
      // console.log(history);
      const d = removeTime(new Date());
      let month = d.getUTCMonth();
      let j=1;
      let k 
      while(j<=3) {
         for(let i=l-1; i>=0 && i>=(l-(32*j)); i--) {
            if(this.history[i].date.getUTCMonth() === month) {
               monthStreak.push(this.history[i])
               // console.log(this.history[i].date)
            }
            else {
               break;
            }
         }
         // console.log("MonthStreak" + monthStreak.length);
         // monthStreak.push("Bleh")
         this.histStreak.push({month: month, monthStreak: monthStreak});
         monthStreak = [];
         j++;
         // console.log("Month" + month);
         month = new Date(d.setMonth(month-1)).getMonth();        
      }

      // this.histStreak.forEach((streak) => {
      //    console.log("Month" + streak.month)
      //    console.log("monthStreak" + streak.monthStreak)
      // })
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
