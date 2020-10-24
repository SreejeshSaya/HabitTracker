import { Component, OnInit, Input } from '@angular/core';

@Component({
   selector: 'app-streak-calendar',
   templateUrl: './streak-calendar.component.html',
   styleUrls: ['./streak-calendar.component.css'],
})
export class StreakCalendarComponent implements OnInit {
   nDays;
   nDaysLeft = [29, 30, 31];
   monthsWith30 = [3, 5, 8, 10];
   // @Input('monthlyStreak') streak: {month: number, monthStreak: Array<{date: Date,completed: boolean, dateTime: Date}> };
   @Input('monthlyStreak') streak;

   months;
   constructor() {
      
   }

   ngOnInit(): void {
      console.log('Hello' + this.streak);
      const d = new Date();
      const currMonth = this.streak.month;
      if(currMonth == 1) {
        if(!(d.getUTCFullYear() % 4 == 0 && d.getUTCFullYear() % 100 !=0))
          this.nDaysLeft.pop();
        this.nDaysLeft.pop();
      }
      else if(this.monthsWith30.includes(currMonth))
        this.nDaysLeft.pop();
   }
}
