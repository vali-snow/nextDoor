import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  @Input() rows: [];

  constructor() {

  }

  ngOnInit() {
    const formGroup = {};
    this.rows.forEach( (row: []) => {
      row.forEach((filter: any) => {
        if (filter.key) {
          formGroup[filter.key] = new FormControl(filter.value || '');
        }
      });
    });
    this.form = new FormGroup(formGroup);
  }

  getFormValues() {
    const values = {};
    Object.keys(this.form.controls).forEach(key => {
      values[key] = this.form.controls[key].value;
    });
    return values;
  }
}
