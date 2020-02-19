import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  @Input() rows: [];
  private formRows: any[] = [];

  constructor() { }

  ngOnInit() {
    const formGroup = {};
    this.rows.forEach((row: any[]) => {
      Object.keys(row).forEach((key: string) => {
        switch (key) {
          case 'placeholder':
            break;
          case 'select':
            formGroup[key] = new FormControl(row[key].value || '', this.getValidators(row[key].validation));
            break;
          default:
            formGroup[key] = new FormControl(row[key].value || '', this.getValidators(row[key].validation));
            break;
        }
      });
      this.formRows.push(Object.keys(row).map(key => {
        return Object.assign({}, { key: key }, row[key]);
      }));
    });
    this.form = new FormGroup(formGroup);
  }

  getValidators(validationObj) {
    const validators = [];
    if (validationObj) {
      for (const key of Object.keys(validationObj)) {
        if (key === 'required') {
          validators.push(Validators.required);
        } else if (key === 'min') {
          validators.push(Validators.min(validationObj[key]));
        }
      }
    }
    return validators;
  }

  getFormValues() {
    const values = {};
    Object.keys(this.form.controls).forEach(key => {
      values[key] = this.form.controls[key].value;
    });
    return values;
  }

  getFormObj(searchKey: string) {
    let found = null;
    for (const row of this.rows) {
      for (const key of Object.keys(row)) {
        if (searchKey === key) {
          return found = row[key];
        }
      }
    }
    return null;
  }

  // onCompareWith(o1: any, o2: any): boolean {
  //   return o1.des === o2.des;
  // }
}
