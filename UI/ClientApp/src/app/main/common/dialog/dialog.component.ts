import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormComponent } from '../form/form.component';
import { ImageDetail } from 'src/models/imagedetail.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  rows = [];
  buttons = [];
  images: {
    imgURL: string | ArrayBuffer,
    file: File
  }[] = [];

  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();

  @ViewChild('dialogForm', {static: false}) dialogForm: FormComponent;

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.rows = data.dynamic.filters;
    this.buttons = data.dynamic.buttons;
  }

  ngOnInit() {}

  onClick(buttonKey: string): void {
    this.buttonClicked.emit(buttonKey);
  }

  onClose() {
    this.dialogRef.close();
  }

  getFormValues() {
    return this.dialogForm.getFormValues();
  }

  getImages() {
    return this.images.map(i => i.file);
  }

  getInOrder(a, b) {
    return a.order > b.order ? a : b;
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.images.push({
          imgURL: reader.result,
          file: event.target.files[0]
        });
      };
    }
  }
}
