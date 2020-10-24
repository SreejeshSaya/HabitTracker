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
   passwordStatusText;
   passwordStatusStyle={
      display:'none',
      color:'green'
   }
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
      if (!(this.newPassword.length>0 && this.newPasswordC.length>0 && this.oldPassword.length>0)){
         // no
      }
      else if (this.newPassword!=this.newPasswordC){
         this.newPassword=this.newPasswordC=this.oldPassword=""
         this.putStatus('Passwords not equal',500)
      }
      else {
         this.authService.updatePassword(this.oldPassword,this.newPassword)
         .subscribe((data: string)=>{
            if (data=='Ok'){
               this.putStatus('Successfully updated password',200)
               this.newPassword=this.newPasswordC=this.oldPassword=""
            }
            else {
               console.log(data)
               this.putStatus(data,500)
               this.newPassword=this.newPasswordC=this.oldPassword=""
            }
         })
      }
   }

   putStatus(text: string,status: number){
      this.passwordStatusStyle.display='block'
      if (status==200){
         this.passwordStatusStyle.color = 'green'
      }
      else {
         this.passwordStatusStyle.color = 'red'
      }
      this.passwordStatusText = text
   }

   ngOnDestroy(){
      this.authSub.unsubscribe();
      this.routeSub.unsubscribe();
   }

   onUploadImage(url: string){
      this.profileImageUrl = url 
   }

}