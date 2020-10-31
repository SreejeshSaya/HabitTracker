import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {concatMap,map,filter,switchMap } from 'rxjs/operators';
import { HabitService } from '../habit.service';

@Pipe({
   name:"HabitFilter",
   pure:false
})
export class HabitFilter implements PipeTransform{
   transform(habits:Array<any>,state:string):Array<any> {
      return habits.filter(h=>h.state==state)
   }
}


@Component({
   selector: 'app-pending',
   templateUrl: './pending.component.html',
   styleUrls: ['./pending.component.css'],
})
export class PendingComponent implements OnInit {
   addText;
   authSub;
   routeSub;
   currentTab='PENDING';
   userHabits;
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
            this.userHabits = this.habitService.userHabits
            console.log(this.habitService.userHabits)
         } else if (!l) {
            this.router.navigateByUrl('/');
         }
      });
   }


   switchTab(){
      if (this.currentTab=="PENDING"){
         this.currentTab = "COMPLETED"
      }
      else {
         this.currentTab="PENDING";
      }
   }


   ngOnDestroy(){
      this.authSub.unsubscribe();
      this.routeSub.unsubscribe();
   }

   completeHabitToday({ev,index}){
      ev.stopPropagation()
      console.log("commmmmmmmm",index) 
      this.habitService.completeToday(index)
      .subscribe(data=>{
      },
      err=>{
         console.log("complete error",err)
      })
   }
   removeCompleteToday({ev,index}){
      ev.stopPropagation()
      console.log("commmmmmmmm",index) 
      this.habitService.removeCompleteToday(index)
      .subscribe(data=>{
      },
      err=>{
         console.log("complete error",err)
      })
   }
}
