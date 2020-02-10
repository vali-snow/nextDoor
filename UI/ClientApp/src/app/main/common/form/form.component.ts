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
  private formRows: any[] = [];

  constructor() {}

  ngOnInit() {
    const formGroup = {};
    this.rows.forEach((row: any[]) => {
      Object.keys(row).forEach((key: string) => {
        if (row[key].type !== 'placeholder') {
          formGroup[key] = new FormControl(row[key].value || '');
        }
      });
      this.formRows.push(Object.keys(row).map(key => {
        return Object.assign({}, { key: key }, row[key]);
      }));
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
}
