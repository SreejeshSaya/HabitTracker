import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { PublicService } from '../public.service';

@Component({
   selector: 'app-user-details-public',
   templateUrl: './user-details-public.component.html',
   styleUrls: ['./user-details-public.component.css'],
})
export class UserDetailsPublicComponent implements OnInit {
   isLoading=true;
   publicProfile;
   dateJoined;
   dateJoinedYear;
   sdata;
   pdata;
   constructor(private authService: AuthService,private publicData: PublicService,private router: Router,private route: ActivatedRoute ) {

   }

   ngOnInit(): void {
      this.route.params.pipe(
         switchMap((r)=>{
            return this.publicData.getPublicProfile(r.userId)
         })
      ).subscribe(publicProfile=>{
         console.log(publicProfile)
         this.isLoading = false
         this.publicProfile = publicProfile
         this.dateJoined = new Date(this.authService.userDetails.createdAt)
         this.dateJoinedYear = this.dateJoined.getFullYear()
         this.dateJoined = this.dateJoined.toDateString().slice(4);
         this.sdata = this.publicProfile.streakHistory.map(h=>{return {date: new Date(h.date),value: h.streak}})
         this.pdata = this.publicProfile.punctualityHistory.map(h=>{return {date: new Date(h.date),value: h.punctuality, changeCnt: h.changeCnt}})
      },(err)=>{
         this.isLoading = false
      })
      this.authService.getUserDetails()
   }

}
