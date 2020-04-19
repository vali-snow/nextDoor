import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProductsService } from '../products.service';
import { Observable } from 'rxjs';

@Injectable()
export class ProductDetailResolver implements Resolve<any> {
  constructor(private productsService: ProductsService) {}

  resolve( route: ActivatedRouteSnapshot): Observable<any>|Promise<any>|any {
    const id = route.paramMap.get('id');
    return this.productsService.getProduct(id);
  }
}
