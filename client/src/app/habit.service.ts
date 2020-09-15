import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, retry, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
   providedIn: 'root',
})
export class HabitService {
   isLoading$ = new BehaviorSubject<boolean>(true);
   userHabits;
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

   getUserHabits(forceReload= false) {
      this.isLoading$.next(true);
      this.http.get('/api/get-user-habits')
      .subscribe(res => {
         this.userHabits = res;
         this.isLoading$.next(false);
      },
      err => {
         this.isLoading$.next(false);
      });
   }

   addHabit(habit){
      return this.http.post('/api/add-habit', {
         text: habit
      }).pipe(tap(res => {
         this.userHabits.push(res);
      }));
   }

   removeHabit(index){
      const habitId = this.userHabits[index]._id;
      this.userHabits = this.userHabits.filter((_, i) => i != index);
      return this.http.post('/api/delete-habit', {
         habitId
      }, {
         responseType: 'text'
      });
   }
}
