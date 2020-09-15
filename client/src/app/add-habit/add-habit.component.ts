import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitService } from '../habit.service';

@Component({
   selector: 'app-add-habit',
   templateUrl: './add-habit.component.html',
   styleUrls: ['./add-habit.component.css'],
})
export class AddHabitComponent implements OnInit {
   habitText: string;
   loading: boolean = false;
   routeSub;
   constructor(public habitService: HabitService,private router:Router, private route:ActivatedRoute) {
      this.routeSub = route.params.subscribe(data=>{
         this.loading =false;
      })
   }

   ngOnInit(): void {}

   addHabit() {
      if (this.habitText) {
         this.loading =true;
         this.habitService.addHabit(this.habitText)
         .subscribe(data=>{
            this.loading =false;
            this.router.navigateByUrl("/")
         });
      }
   }

   ngOnDestroy(){
      this.routeSub.unsubscribe()
   }
}
