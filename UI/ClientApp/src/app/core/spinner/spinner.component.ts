import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})

export class SpinnerComponent {
  loading: Subject<boolean> = this.spinnerService.loading;
  constructor(private spinnerService: SpinnerService) { }
}
