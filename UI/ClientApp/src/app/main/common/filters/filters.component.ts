import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilterModel } from 'src/models/filters/filter.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Input() model: FilterModel;
  @Output() filterApply: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onFilterApplyClick() {
    this.filterApply.emit();
  }

  onFilterClearClick() {

  }
}
