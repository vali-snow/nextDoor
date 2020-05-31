import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-image9-dialog',
  templateUrl: './image9-dialog.component.html',
  styleUrls: ['./image9-dialog.component.css']
})
export class Image9DialogComponent implements OnInit {
  index: number;
  images: (string | ArrayBuffer) [] = [];
  constructor(public dialogRef: MatDialogRef<Image9DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.images = data.images;
    this.index = +data.index;
  }

  ngOnInit() {
  }

  onNavigateBefore() {
    if (this.index === 0) {
      this.index = this.images.length - 1;
      return;
    }
    this.index--;
  }

  onNavigateNext() {
    if (this.index === this.images.length - 1) {
      this.index = 0;
      return;
    }
    this.index++;
  }

  onImageClick(index: number) {
    this.index = index;
  }

}
