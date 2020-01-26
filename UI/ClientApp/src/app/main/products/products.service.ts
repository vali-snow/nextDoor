import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { single} from 'rxjs/operators';
import { ProductFilters } from 'src/models/filters/product.filters.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts(filters?: ProductFilters): Observable<any> {
    let params = new HttpParams();
    if (filters && filters.isOwner) {
      params = params.set('isOwner', filters.isOwner.toString());
    }
    return this.http.get('https://localhost:44377/api/Products/', { params: params }).pipe(single());
  }
}
