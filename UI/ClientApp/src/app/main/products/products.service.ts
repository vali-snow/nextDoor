import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { single} from 'rxjs/operators';
import { ProductFilters } from 'src/models/filters/product.filters.model';
import { Product } from 'src/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`https://localhost:44377/api/Products/${id}`).pipe(single());
  }

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.isOwner) {
        params = params.set('isOwner', filters.isOwner.toString());
      }
      if (filters.search && filters.search !== '') {
        params = params.set('search', filters.search);
      }
      if (filters.productType !== null && filters.productType !== undefined) {
        params = params.set('productType', filters.productType.toString());
      }
    }
    return this.http.get<Product[]>('https://localhost:44377/api/Products/', { params: params }).pipe(single());
  }

  saveProduct(product: Product) {
    return this.http.post<Product>('https://localhost:44377/api/Products/', product).pipe(single());
  }

  removeProduct(id: string) {
    return this.http.delete<Product>(`https://localhost:44377/api/Products/${id}`).pipe(single());
  }
}
