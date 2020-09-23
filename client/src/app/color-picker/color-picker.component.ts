import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
   selector: 'app-color-picker',
   templateUrl: './color-picker.component.html',
   styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent implements OnInit {
   @Input() colors;
   @Output() colorChange: EventEmitter<any> = new EventEmitter();
   @Input() default;
   selectedColor:string;
   constructor() {}

   ngOnInit(): void {
      this.selectedColor = this.default
      console.log(this.colors,this.colorChange)
   }

   onColorClick(color){
      this.selectedColor = this.selectedColor==color?this.default:color;
      this.colorChange.emit(this.selectedColor)
   }
}
