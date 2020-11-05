import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
   selector: 'app-tag',
   templateUrl: './tag.component.html',
   styleUrls: ['./tag.component.css'],
})
export class TagComponent implements OnInit {
   @Input() text:string
   @Input() pos:number
   @Output() remove = new EventEmitter<number>();

   constructor() {}

   ngOnInit(): void {}
   onRemove(){
      console.log("rem",this.pos)
      this.remove.emit(this.pos)
   }
}
