import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { HabitService } from 'src/app/habit.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { concatMap, tap, map, filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { getDateString, getHistory, removeTime } from 'src/app/dateManager';
import { colors } from 'src/app/colors';
import { makePunctualityGraph, makeStreakGraph } from 'src/app/grapher';
import { MatChipInputEvent } from '@angular/material/chips';

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
   message = 'test';
   sdata;
   pdata;
   addTagText;
   tags = []
   selectable = true;
   removable = true;
   addOnBlur = true;
   readonly separatorKeysCodes: number[] = [ENTER, COMMA];
   constructor(
      public router: Router,
      public route: ActivatedRoute,
      public authService: AuthService,
      public habitService: HabitService
   ) {
      this.routeSub = route.params.subscribe((val) => {
         this.habitId = +val['habitId'];
         if (!this.authService.userDetails) {
            this.authService.getUserDetails();
         }
      });
      this.colors = colors;
   }

   ngOnInit(): void {
      this.authSub = this.authService.isLoading$
         .pipe(
            map((l) => {
               if (!l && this.authService.userDetails) {
                  return true;
               } else if (!l) {
                  this.router.navigateByUrl('/login');
               } else {
                  return false;
               }
            }),
            filter((l) => l),
            switchMap((_) => {
               return this.habitService.isLoading$;
            })
         )
         .subscribe((l) => {
            if (
               !l &&
               this.habitService.userHabits &&
               this.habitService.userHabits[this.habitId]
            ) {
               this.habit = this.habitService.userHabits[this.habitId];
               this.text = this.habit.text;
               this.endDate = getDateString(this.habit.endDate);
               this.history = getHistory(
                  this.habit.createdAt,
                  this.habit.history
               );
               this.tags = this.habit.tags
               this.selectedColor = this.habit.color;
               this.createStreakCalendar();
               this.pdata = makePunctualityGraph(
                  this.habit,
                  this.habit.history,
                  90
               );
               this.sdata = makeStreakGraph(this.habit, this.habit.history, 90);
            } else if (!l) {
               this.router.navigateByUrl('/');
            }
         });
   }

   updateHabit() {
      this.habitService
         .updateHabit(
            this.habit.index,
            this.text,
            this.selectedColor,
            this.endDate,
            this.tags
         )
         .subscribe((d) => {
            this.router.navigateByUrl('/');
         });
   }

   createStreakCalendar() {
      let monthStreak = [];
      const d = removeTime(new Date());
      let month = d.getMonth();
      let i = this.history.length - 1;
      console.log(this.history);
      let j = 0;
      while (j < 3) {
         while (i >= 0) {
            if (this.history[i].date.getMonth() === month) {
               monthStreak.push(this.history[i]);
            } else {
               break;
            }
            i--;
         }
         this.histStreak.push({ month: month, monthStreak: monthStreak });
         monthStreak = [];
         j++;
         month = new Date(d.setMonth(month - 1)).getMonth();
      }
   }

   ngOnDestroy() {
      this.routeSub.unsubscribe();
      this.authSub.unsubscribe();
   }

   deleteHabit() {
      this.habitService.deleteHabit(this.habit.index).subscribe((d) => {
         this.router.navigateByUrl('/');
      });
   }
   colorChange(color) {
      this.selectedColor = color;
   }

   makeStreakGraph() {}

   addTag(event: MatChipInputEvent){
      console.log("ADD tag")
      this.addTagText = event.value;
      if ((this.addTagText || '').trim()) {
         this.tags.push(this.addTagText.trim())
       }
      if(event.input) {
         event.input.value = '';
      }
   }

   remTag(tag: string){
      console.log("Remove", tag)
      const index = this.tags.indexOf(tag);

      if (index >= 0) {
        this.tags.splice(index, 1);
      }
      console.log("REmoved", this.tags)
      // console.log("aa",pos)
      // this.tags = this.tags.filter((_,i)=>pos!=i)
   }

}
