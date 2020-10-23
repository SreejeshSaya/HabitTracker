import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HabitService } from '../habit.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
   routeSub;
   authSub;
   username;
   oldPassword;
   newPassword;
   newPasswordC;
   profileImageUrl;
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
            // this.userHabits = this.habitService.userHabits
            console.log(this.habitService.userHabits)
            this.username = this.authService.userDetails.username
            this.profileImageUrl = this.authService.userDetails.profileImageUrl
         } else if (!l) {
            this.router.navigateByUrl('/');
         }
      });
   }

   updateDetails(){
      this.authService.updateUserDetails(this.username,this.profileImageUrl)
      .subscribe(res=>{
         if (res=='Success'){
            console.log("Update success")
            this.router.navigateByUrl("/")
         }
         else {
            console.log("Update error: ",res)
         }
      })
   }

   updatePassword(){

   }

   ngOnDestroy(){
      this.authSub.unsubscribe();
      this.routeSub.unsubscribe();
   }

   onUploadImage(url: string){
      this.profileImageUrl = url 
   }

}