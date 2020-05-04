import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { single } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DashDTO } from 'src/models/dto/dashDTO.model';

@Injectable({
  providedIn: 'root'
})
export class DashService {

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  getDashboardInformation(): Observable<DashDTO> {
    return this.http.get<DashDTO>('https://localhost:44377/api/Dashboard/').pipe(single());
  }
}
