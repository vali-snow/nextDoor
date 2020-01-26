import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderFilters } from 'src/models/filters/order.filters.model';
import { single } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  getOrders(filters?: OrderFilters): Observable<any> {
    let params = new HttpParams();
    if (filters && filters.orderType !== null && filters.orderType !== undefined) {
      params = params.set('orderType', filters.orderType.toString());
    }
    if (filters && filters.orderStatus !== null && filters.orderStatus !== undefined) {
      params = params.set('orderStatus', filters.orderStatus.toString());
    }
    if (filters && filters.productType !== null && filters.productType !== undefined) {
      params = params.set('productType', filters.productType.toString());
    }
    if (filters && filters.date !== null && filters.date !== undefined) {
      if (filters.date.start) {
        params = params.set('date.start', filters.date.start.toISOString());
      }
      if (filters.date.end) {
        params = params.set('date.end', filters.date.end.toISOString());
      }
    }
    return this.http.get('https://localhost:44377/api/Orders/', { params: params }).pipe(single());
  }
}
