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
   updateUserDetails(username,profileImageUrl){
      console.log("reeevccvv",username)
      return this.http.post('/api/auth/update-user-details',{
         username,profileImageUrl
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
   updatePassword(oldPassword,newPassword){
      return this.http.post('/api/auth/update-password',{
         oldPassword,newPassword
      }).pipe(
         map((d: any)=>{
            if(d.status=="Ok"){
               return "Ok"
            }
            else {
               return "Unknown error"
            }
         }),
         catchError((d: any)=>{
            return of(d.error.error)
         })
      )
   }
   signUp(signupCred: {username: string, password: string, email: string}) {
      return this.http.post(
         '/api/auth/signup',
         signupCred,
         {
            responseType: 'text',
         }
      );
   }

   logIn(loginCred: {email: string, password: string}) {
         return this.http.post(
            '/api/auth/login',
            loginCred,
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

   uploadImage(file){
      const data =  new FormData()
      data.append("file",file)
      return this.http.post('/api/auth/upload-image',data)
   }
}
