import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Image9DialogComponent } from './dialog/image9-dialog/image9-dialog.component';

@Component({
  selector: 'app-image9',
  templateUrl: './image9.component.html',
  styleUrls: ['./image9.component.css']
})
export class Image9Component implements OnInit {
  @Input() images: (string | ArrayBuffer) [] = [];
  @Input() isEditable = false;
  @Output() removeImage = new EventEmitter<number>();
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  onRemoveImage(index: number) {
    this.removeImage.emit(index);
  }

  onImageClick(index: number) {
    this.dialog.open(Image9DialogComponent, {
      width: '806px',
      data: {
        images: this.images,
        index: index
      }
    });
  }

}
