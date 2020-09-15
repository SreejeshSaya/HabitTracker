import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
   selector: 'app-habit-small',
   templateUrl: './habit-small.component.html',
   styleUrls: ['./habit-small.component.css'],
})
export class HabitSmallComponent implements OnInit {
   @Input() text: string;
   @Input() index: number;
   @Output() remove: EventEmitter<any> = new EventEmitter()
   constructor() {}

   ngOnInit(): void {
      console.log("small",this.index)
   }
}
