import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
   selector: 'app-profile-upload',
   templateUrl: './profile-upload.component.html',
   styleUrls: ['./profile-upload.component.css'],
})
export class ProfileUploadComponent implements OnInit {
   @Output() onUploadImage = new EventEmitter<any>();
   @Input() imageUrl: string;
   @ViewChild('file') input;
   loadingImage: string  = 'https://i.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif'
   constructor(private authService: AuthService) {

   }

   ngOnInit(): void {
      
   }

   fileSelect(ev){
      
      const selectedFile = ev.target.files[0]
      const type = selectedFile.type
      if ( !type.match(/image/) ){
         ev.target.value=""
         return alert("Select an image ")
      }
      if (selectedFile.size>500*1024){
         ev.target.value=""
         return alert("File too big")
      }
      
      this.imageUrl = this.loadingImage
      this.authService.uploadImage(selectedFile).subscribe((data: any)=>{
         this.imageUrl = data.url
         this.onUploadImage.emit(data.url)
      })
   }
}
