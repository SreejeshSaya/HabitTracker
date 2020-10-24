import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, retry, switchMap, tap,map,filter } from 'rxjs/operators';
import { AuthService } from './auth.service';

import  {removeTime,habitEnded,getStreak,getMaxStreak} from './dateManager'

@Injectable({
   providedIn: 'root',
})
export class HabitService {
   isLoading$ = new BehaviorSubject<boolean>(true);
   userHabits;
   pendingLength
   constructor(private http: HttpClient, private authService: AuthService) {
      this.authService.isLoading$
      .subscribe(loading => {
         console.log('habit service', loading, this.authService.userDetails);
         if (!loading && this.authService.userDetails){
            this.getUserHabits();
         }
         else if (!loading){
            this.userHabits = undefined;
         }
      });
   }

   parseUserHabits(){
      this.userHabits.forEach((habit,index)=>{
         // console.log("fffff",habit)
         this.populateHabit(habit,index)
         // console.log("fffff",habit)
      })
   }

   populateHabit(habit,index){
      habit.index=  index
      habit.createdAt = new Date(habit.createdAt)
      habit.endDate = new Date(habit.endDate)
      habit.history = habit.history.map((d)=>{
         // console.log(d)
         return {...d,date:new Date(d.date)}
      })
      habit.streak = getStreak(habit.history)
      habit.maxStreak = getMaxStreak(habit.history)
      habit.daysLeft = Math.floor((removeTime(habit.endDate).valueOf() - Date.now().valueOf())/(1000*60*60*24))+1
      if (habitEnded(habit.endDate)){
         habit.state="ENDED"
      }
      else if (habit.history.length==0){
         habit.state = "PENDING"
      }
      else{
         const lastDate = habit.history[habit.history.length-1].date
         // console.log(habit,lastDate)
         if (removeTime(lastDate)>=removeTime(new Date()) ){
            habit.state= "COMPLETED"
         }
         else {
            habit.state = "PENDING"
         }
      }
   }

   getUserHabits(forceReload= false) {
      this.isLoading$.next(true);
      this.http.get('/api/get-user-habits')
      .subscribe(res => {
         this.userHabits = res;
         this.parseUserHabits()
         this.isLoading$.next(false);
         console.log("i got habits", this.userHabits)
      },
      err => {
         this.isLoading$.next(false);
      });
   }

   addHabit(habit,color,endDate){
      return this.http.post('/api/add-habit', {
         text: habit,color,endDate
      }).pipe(tap(res => {
         const nextIndex = this.userHabits.length
         this.populateHabit(res,nextIndex)
         this.userHabits.push(res);
      }),catchError(err=>{
         return "Add failed"
         
      }));
   }

   updateHabit(habitIndex,text,color,endDate){
      const habit = this.userHabits[habitIndex]
      return this.http.post('/api/update-habit', {
         habitId:habit._id,text,color,endDate
      }).pipe(tap(res => {
         this.populateHabit(res,habitIndex)
         this.userHabits[habitIndex] = res
      }),catchError(err=>{
         return "Update failed"
      }));
   }

   deleteHabit(index){
      const habitId = this.userHabits[index]._id;
      this.userHabits = this.userHabits.filter((_, i) => i != index);
      return this.http.post('/api/delete-habit', {
         habitId
      }, {
         responseType: 'text'
      }).pipe(tap(res => {
      }),catchError(err=>{
         return "Remove failed"
      }));
   }

   completeToday(habitIndex){
      const habit = this.userHabits[habitIndex];
      const habitId = habit._id
      habit.state="COMPLETED"
      console.log("start update")
      return this.http.post('/api/complete-habit-today', {
         habitId
      }).pipe(tap(newHabit => {
         console.log("updating habit")
         this.populateHabit(newHabit,habitIndex)
         this.userHabits[habitIndex] = newHabit
         console.log("updated",newHabit)
      }),catchError(err=>{
         console.error(err)
         return "Remove failed"
      }) );
   }

   getPendingHabits(){
      // return this.isLoading$.pipe(filter(l=>l),
      // switchMap(_=>{
      //    return of(this.userHabits.filter( h=>h.state=="PENDING" ))
      // }))
      return this.userHabits.filter( h=>h.state=="PENDING" )
   }

   getCompletedHabits(){
      // return this.isLoading$.pipe(filter(l=>l),
      // switchMap(_=>{
      //    return of(this.userHabits.filter( h=>h.state=="COMPLETED" ))
      // }))
      return this.userHabits.filter( h=>h.state=="COMPLETED" )
   }

}
