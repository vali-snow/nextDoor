import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { OrdersService } from '../orders.service';
import { Observable } from 'rxjs';


@Injectable()
export class OrderDetailResolver implements Resolve<any> {
  constructor(private ordersService: OrdersService) {}

  resolve( route: ActivatedRouteSnapshot): Observable<any>|Promise<any>|any {
    const id = route.paramMap.get('id');
    return this.ordersService.getOrder(id);
  }
}
