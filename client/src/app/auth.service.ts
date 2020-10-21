import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, retry, switchMap, tap,map } from 'rxjs/operators';



@Injectable({
   providedIn: 'root',
})
export class AuthService {
   isLoading$ = new BehaviorSubject<boolean>(true);
   userDetails;

   constructor(private http: HttpClient) {}

   getUserDetails() {
      this.isLoading$.next(true);
      this.http.get('/api/auth/get-user-details')
      .subscribe(data => {
         console.log('atuh get', data);
         this.userDetails = data;
         this.isLoading$.next(false);
      },
      err => {
         console.log(err);
         this.isLoading$.next(false);
      });
   }
   updateUserDetails(username){
      console.log("reeevccvv",username)
      return this.http.post('/api/auth/update-user-details',{
         username
      }).pipe(
         map(d=>{
            this.userDetails = d
            return "Success"
         }),
         catchError(d=>{
            return d.error
         })
      )
   }
   signUp(username, password, email) {
      return this.http.post(
         '/api/auth/signup',
         {
            username,
            password,
            email,
         },
         {
            responseType: 'text',
         }
      );
   }

   logIn(email, password) {
      return this.http.post(
         '/api/auth/login',
         {
            email,
            password,
         },
         {
            responseType: 'text',
         }
      );
   }

   logOut(){
      if (this.userDetails){
         this.userDetails = undefined;
         this.isLoading$.next(true);
         this.http.post('/api/auth/logout', {}, {
            responseType: 'text'
         }).subscribe(data => {
            this.isLoading$.next(false);
         });
      }
   }
}
