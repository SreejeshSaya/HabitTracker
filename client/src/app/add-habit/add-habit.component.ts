import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitService } from 'src/app/habit.service';
import {colors} from 'src/app/colors'
import { RecommendService } from '../recommend.service';

@Component({
   selector: 'app-add-habit',
   templateUrl: './add-habit.component.html',
   styleUrls: ['./add-habit.component.css'],
})
export class AddHabitComponent implements OnInit {
   habitText: string;
   endDate:string;
   selectedColor:string;
   loading: boolean = false;
   routeSub;
   colors;
   tags = [
      "hoho",
      "haha"
   ]
   addTagText;
   constructor(public habitService: HabitService,private router:Router, private route:ActivatedRoute,public recommender:RecommendService) {
      this.routeSub = route.queryParams.subscribe(data=>{
         console.log("here",data)
         this.habitText = data.text
         if (data.tag){
            this.tags  = [data.tag]
         }
         this.loading =false;
      })
      this.colors = colors
   }

   ngOnInit(): void {}

   addHabit() {
      if (this.habitText) {
         this.loading =true;
         this.habitService.addHabit(this.habitText,this.selectedColor,this.endDate,this.tags)
         .subscribe(data=>{
            this.loading =false;
            // this.router.navigateByUrl("/")
         });
      }
   }

   ngOnDestroy(){
      this.routeSub.unsubscribe()
   }

   colorChange(color){
      this.selectedColor = this.selectedColor==color?"":color;
   }

   addTag(){
      this.tags.push(this.addTagText)
   }

   remTag(pos:number){
      console.log("aa",pos)
      this.tags = this.tags.filter((_,i)=>pos!=i)
   }

   onRecommendClick(){
      this.recommender.recommend()
      .subscribe(({text,tag})=>{
         console.log("nabigate",text,tag)
         
         this.router.navigateByUrl(`/add-habit?text=${text}&tag=${tag}`)
      })
   }
}
