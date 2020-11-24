import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, retry, switchMap, tap,map,filter } from 'rxjs/operators';
import { AuthService } from './auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

import  {removeTime,habitEnded,getStreak,getMaxStreak} from './dateManager'

@Injectable({
   providedIn: 'root',
})
export class HabitService {
   isLoading$ = new BehaviorSubject<boolean>(true);
   userHabits;
   pendingLength;

   pendingQueue:[string,number][]=[];
   timeoutId:number=-1

   constructor(private snackbar: MatSnackBar,private http: HttpClient, private authService: AuthService) {
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

   addHabit(habit,color,endDate,tags){
      return this.http.post('/api/add-habit', {
         text: habit,color,endDate,tags
      }).pipe(tap(res => {
         const nextIndex = this.userHabits.length
         this.populateHabit(res,nextIndex)
         this.userHabits.push(res);
      }),catchError(err=>{
         return "Add failed"
         
      }));
   }

   updateHabit(habitIndex,text,color,endDate,tags){
      const habit = this.userHabits[habitIndex]
      return this.http.post('/api/update-habit', {
         habitId:habit._id,text,color,endDate,tags
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
         this.snackbar.open("Network Error, Please try again later","dismiss",{duration:2000})
         return "Remove failed"
      }));
   }

   completeToday(habitIndex){
      const habit = this.userHabits[habitIndex];
      habit.state="COMPLETED"
      this.pendingQueue.push(["complete",habitIndex])
      this.updateTimeout()
      return of(true)
   }

   updateTimeout(){
      if (this.timeoutId!=-1){
         window.clearTimeout(this.timeoutId)
      }
      this.timeoutId = window.setTimeout(()=>{
         this.timeoutId = -1
         this.completeUpdates().subscribe()
      },1000)
   }

   removeCompleteToday(habitIndex){
      const habit = this.userHabits[habitIndex];
      habit.state="PENDING"
      this.pendingQueue.push(["uncomplete",habitIndex])
      this.updateTimeout()
      return of(true)
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

   completeUpdates(){
      const pending = this.pendingQueue.map(([s,i])=>[s,i])
      this.pendingQueue = []
      const body = pending.map(([type,index])=>{ // a list of update type and habit id
            return [type,this.userHabits[index]._id]
      })

      return this.http.post("/api/update-bulk",body).pipe(
         tap((newHabits:any)=>{
            newHabits.forEach((h,i)=>{ // update each habit
               this.populateHabit(h,pending[i][1])
               this.userHabits[pending[i][1]] = h
            })
         }),retry(2),
         catchError(err=>{
            this.snackbar.open("Network Error, Please try again later","dismiss",{duration:2000})
            console.error(err)
            for (let [s,i] of pending){ // revert to previous state
               if (s=="complete"){
                  this.userHabits[i].state="PENDING"
               }
               else {
                  this.userHabits[i].state="COMPLETED"
               }
            }
            return "Remove failed"
         })
      )
   }

}
