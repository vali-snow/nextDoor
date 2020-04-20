import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { OrdersService } from './orders.service';
import { Observable } from 'rxjs';
import { OrderFilters } from 'src/models/filters/order.filters.model';
import { OrderType } from 'src/models/enums/order.type.enum';

@Injectable()
export class OrdersResolver implements Resolve<any> {
  constructor(private ordersService: OrdersService) {}

  resolve( route: ActivatedRouteSnapshot): Observable<any>|Promise<any>|any {
    const show = route.data.show;
    switch (show) {
      case 'toFulfill':
        const toFulfillFilters = {
          orderType: OrderType.ToFulfill,
          search: null,
          orderStatus: null,
          productType: null,
          dateRange: null
        } as OrderFilters;
        return this.ordersService.getOrders(toFulfillFilters);
      case 'toReceive':
        const toReceiveFilters = {
          orderType: OrderType.ToReceive,
          search: null,
          orderStatus: null,
          productType: null,
          dateRange: null
        } as OrderFilters;
        return this.ordersService.getOrders(toReceiveFilters);
    }
  }
}
