import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { PublicService } from '../public.service';

function getDocHeight() {
   var D = document;
   return Math.max(
       D.body.scrollHeight, D.documentElement.scrollHeight,
       D.body.offsetHeight, D.documentElement.offsetHeight,
       D.body.clientHeight, D.documentElement.clientHeight
   );
}

@Component({
   selector: 'app-leaderboard',
   templateUrl: './leaderboard.component.html',
   styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
   leaderboard=[];
   loading=true;
   pageNumber=1
   lastPage=1
   pageSize=10
   reachBottom$;
   pageLoading=false
   constructor(
      private authService: AuthService,
      private route: ActivatedRoute,
      private publicData: PublicService,
      private router: Router
   ) {

   }

   ngOnInit(): void {
      this.route.params.pipe(
         switchMap(_=>{
            return this.publicData.getLeaderboard(this.pageNumber,this.pageSize)
         })
      ).subscribe((data:any)=>{
         this.lastPage = data.totalPages
         this.leaderboard = data.data
         this.loading = false
      },err=>{
         console.log(err)
         this.loading =false
         this.router.navigateByUrl("/")
      })
      this.loading = false
      this.authService.getUserDetails()

      this.reachBottom$ = fromEvent(window,"scroll").pipe(
         filter(ev=>{
            return this.hasReachedEnd()
         }),
         map(t=>{
            this.loadNewPage()
         })
      )

      this.reachBottom$.subscribe()
   }

   hasReachedEnd(){
      return window.scrollY+window.innerHeight>getDocHeight()-200
   }

   loadNewPage(){
      if (this.pageNumber!=this.lastPage && !this.pageLoading){
         this.pageNumber+=1
         console.log(this.pageNumber,this.lastPage)
         this.pageLoading = true;
         this.publicData.getLeaderboard(this.pageNumber,this.pageSize).subscribe((data:any)=>{
            this.leaderboard = [...this.leaderboard,...data.data]
            this.pageLoading = false
         })
      }
      
   }

   ngOnDestroy(){

   }
}
