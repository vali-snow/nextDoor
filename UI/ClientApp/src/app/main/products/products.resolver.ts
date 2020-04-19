import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProductsService } from './products.service';
import { Observable } from 'rxjs';
import { ProductFilters } from 'src/models/filters/product.filters.model';

@Injectable()
export class ProductsResolver implements Resolve<any> {
  constructor(private productsService: ProductsService) {}

  resolve( route: ActivatedRouteSnapshot): Observable<any>|Promise<any>|any {
    const show = route.data.show;
    switch (show) {
      case 'all':
        return this.productsService.getProducts();
      case 'mine':
        const filters = {
          isOwner: true
        } as ProductFilters;
        return this.productsService.getProducts(filters);
    }
  }
}
