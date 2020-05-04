import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DashService } from './dash.service';


@Injectable()
export class DashResolver implements Resolve<any> {
  constructor(private dashService: DashService) {}

  resolve(): Observable<any>|Promise<any>|any {
    return this.dashService.getDashboardInformation();
  }
}