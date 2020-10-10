import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
   selector: 'app-habit-small',
   templateUrl: './habit-small.component.html',
   styleUrls: ['./habit-small.component.css'],
})
export class HabitSmallComponent implements OnInit {
   @Input() habit;
   @Output() complete: EventEmitter<any> = new EventEmitter()
   style
   constructor() {
      
   }

   ngOnInit(): void {
      this.style={'box-shadow': `-4px 0 ${this.habit.color},0 2px 20px rgba(128, 128, 128, 0.349)`} //not used
      console.log("style",this.style)
      console.log(this.habit.streak)
      console.log("small",this.habit.daysLeft)
   }
}
