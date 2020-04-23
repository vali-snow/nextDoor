import { Component, OnInit, Inject, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  rows = [];
  buttons = [];
  withImage = false;
  editableImages = true;
  images: {
    imgURL: (string | ArrayBuffer) [],
    file: File[]
  } = {
    imgURL: [],
    file: []
  };

  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();

  @ViewChild('dialogForm', {static: false}) dialogForm: FormComponent;

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.withImage = data.withImage;
    this.rows = data.dynamic.filters;
    this.buttons = data.dynamic.buttons;
    if (data.images) {
      this.images.imgURL = data.images;
      this.editableImages = false;
    }
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
    return this.images.file;
  }

  getInOrder(a, b) {
    return a.order > b.order ? a : b;
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.images.imgURL.push(reader.result);
        this.images.file.push(event.target.files[0]);
      };
    }
  }

  onRemoveImage(index: number) {
    this.images.imgURL.splice(index, 1);
    this.images.file.splice(index, 1);
  }
}
