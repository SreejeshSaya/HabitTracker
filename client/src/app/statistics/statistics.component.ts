import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { HabitService } from '../habit.service';
import { PublicService } from '../public.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
   routeSub: Subscription;
   isLoading=true
   stats;
   message;
   constructor(public authService: AuthService,public publicService: PublicService, private router: Router, public habitService: HabitService, route: ActivatedRoute) {
      this.routeSub = route.params.subscribe(val => {
         this.authService.getUserDetails();
         
      });
   }

  ngOnInit(): void {
     this.publicService.getPublicStats()
     .subscribe(data=>{
        this.stats = data
        this.getMessage()
        console.log("recv stats",data)
        this.isLoading = false
     },error=>{
        this.isLoading= false

     })
  }
  ngOnDestroy(){
     this.routeSub.unsubscribe()
  }
  getMessage(){
     const index =Math.floor( 0.5*this.stats.avgPunctualityUser.length)
     this.message = '50% of the users were punctual '+this.stats.avgPunctualityUser[index]+'% of the time'
  }

}
