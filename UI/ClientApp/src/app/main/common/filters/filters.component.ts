import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilterModel } from 'src/models/filters/filter.model';
import { FormGroup, FormControl } from '@angular/forms';
import { SatDatepickerRangeValue } from 'saturn-datepicker';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  form: FormGroup;
  filters: any[];

  @Input() model: FilterModel;
  @Output() filtersApply: EventEmitter<any> = new EventEmitter();
  @Output() filtersClear: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.filters = Object.keys(this.model.array).map(key => {
      return Object.assign({}, { key: key} , this.model.array[key]);
    });

    const formGroup = {};
    for(const key of Object.keys(this.model.array)) {
      formGroup[key] = new FormControl(this.model.array[key].value || '');
    }

    this.form = new FormGroup(formGroup);
  }

  onFilterApplyClick() {
    const values = {};
    Object.keys(this.model.array).forEach(key => {
      values[key] = this.form.controls[key].value;
    });
    this.filtersApply.emit(values);
  }

  onFilterClearClick() {
    const patchNull = {};
    Object.keys(this.model.array).forEach(key => {
      patchNull[key] = null;
    });
    this.form.setValue(patchNull);
    this.filtersClear.emit();
  }
}
