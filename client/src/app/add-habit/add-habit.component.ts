import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitService } from 'src/app/habit.service';
import {colors} from 'src/app/colors'

@Component({
   selector: 'app-add-habit',
   templateUrl: './add-habit.component.html',
   styleUrls: ['./add-habit.component.css'],
})
export class AddHabitComponent implements OnInit {
   habitText: string;
   endDate:string;
   selectedColor:string;
   loading: boolean = false;
   routeSub;
   colors;
   constructor(public habitService: HabitService,private router:Router, private route:ActivatedRoute) {
      this.routeSub = route.params.subscribe(data=>{
         this.loading =false;
      })
      this.colors = colors
   }

   ngOnInit(): void {}

   addHabit() {
      if (this.habitText) {
         this.loading =true;
         this.habitService.addHabit(this.habitText,this.selectedColor,this.endDate)
         .subscribe(data=>{
            this.loading =false;
            this.router.navigateByUrl("/")
         });
      }
   }

   ngOnDestroy(){
      this.routeSub.unsubscribe()
   }

   colorChange(color){
      this.selectedColor = this.selectedColor==color?"":color;
   }
}
