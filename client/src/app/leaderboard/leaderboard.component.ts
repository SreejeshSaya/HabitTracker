import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PublicService } from '../public.service';

@Component({
   selector: 'app-leaderboard',
   templateUrl: './leaderboard.component.html',
   styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
   leaderboard;
   loading=true;
   constructor(
      private route: ActivatedRoute,
      private publicData: PublicService,
      private router: Router
   ) {

   }

   ngOnInit(): void {
      this.route.params.pipe(
         switchMap(_=>{
            return this.publicData.getLeaderboard()
         })
      ).subscribe(leaderboard=>{
         this.leaderboard = leaderboard
         this.loading = false
      },err=>{
         console.log(err)
         this.loading =false
         this.router.navigateByUrl("/")
      })
   }
}
