import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitService } from 'src/app/habit.service';
import {colors} from 'src/app/colors'
import { RecommendService } from '../recommend.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';

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
   visible = true;
   selectable = true;
   removable = true;
   addOnBlur = true;
   readonly separatorKeysCodes: number[] = [ENTER, COMMA];
   tags: string[] = [];
   addTagText;
   constructor(public habitService: HabitService,private router:Router, private route:ActivatedRoute,public recommender:RecommendService,public dialogRef: MatDialogRef<AddHabitComponent>) {
      this.routeSub = route.queryParams.subscribe(data=>{
         console.log("here",data)
         this.habitText = data.text
         if (data.tag){
            this.tags  = [data.tag]
         }
         this.loading =false;
      })
      this.colors = colors
      this.selectedColor = colors[2];
   }

   ngOnInit(): void {}

   addHabit() {
      if (this.habitText) {
         this.habitService.addHabit(this.habitText,this.selectedColor,this.endDate,this.tags)
         .subscribe(data=>{
            this.dialogRef.close()
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

   addTag(event: MatChipInputEvent){
      console.log("ADD tag")
      this.addTagText = event.value;
      if ((this.addTagText || '').trim()) {
         this.tags.push(this.addTagText.trim())
       }
      if(event.input) {
         event.input.value = '';
      }
   }

   remTag(tag: string){
      console.log("Remove", tag)
      const index = this.tags.indexOf(tag);

      if (index >= 0) {
        this.tags.splice(index, 1);
      }
      console.log("REmoved", this.tags)
      // console.log("aa",pos)
      // this.tags = this.tags.filter((_,i)=>pos!=i)
   }

   onRecommendClick(){
      this.recommender.recommend()
      .subscribe(({text,tag})=>{
         console.log("nabigate",text,tag)
         
         this.habitText = text
         this.tags = [tag]
      })
   }
}
