import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderFilters } from 'src/models/filters/order.filters.model';
import { single } from 'rxjs/operators';
import { Order } from 'src/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`https://localhost:44377/api/Orders/${id}`).pipe(single());
  }

  getOrders(filters?: OrderFilters): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.orderType !== null && filters.orderType !== undefined) {
        params = params.set('orderType', filters.orderType.toString());
      }
      if (filters.search && filters.search !== '') {
        params = params.set('search', filters.search);
      }
      if (filters.orderStatus !== null && filters.orderStatus !== undefined) {
        params = params.set('orderStatus', filters.orderStatus.toString());
      }
      if (filters.productType !== null && filters.productType !== undefined) {
        params = params.set('productType', filters.productType.toString());
      }
      if (filters.dateRange) {
        if (filters.dateRange.begin) {
          params = params.set('dateRange.begin', filters.dateRange.begin.toISOString());
        }
        if (filters.dateRange.end) {
          params = params.set('dateRange.end', filters.dateRange.end.toISOString());
        }
      }
    }
    return this.http.get('https://localhost:44377/api/Orders/', { params: params }).pipe(single());
  }
}
