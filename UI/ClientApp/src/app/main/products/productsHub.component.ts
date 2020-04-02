import { Component, OnInit } from '@angular/core';
import { EnumService } from 'src/app/core/service/enum.service';
import { ProductsService } from './products.service';
import { ProductFilters } from 'src/models/filters/product.filters.model';
import { FilterModel } from 'src/models/filters/filter.model';
import { Router } from '@angular/router';

@Component({
  templateUrl: './productsHub.component.html',
  styleUrls: ['./productsHub.component.css']
})
export class ProductsHubComponent implements OnInit {
  myProducts = [];
  filterModel: FilterModel = {
    title: 'All Products',
    description: 'Filter Panel',
    array: {
      search: { label: 'Search', type: 'text', size: 80 },
      productType: {label: 'Product Type', type: 'select', size: 20, options: this.enums.getKeysFromEnum('productType')}
    }
  };

  constructor(private products: ProductsService, private enums: EnumService, private router: Router) { }

  ngOnInit() {
    const filters = {
      isOwner: true
    } as ProductFilters;
    this.products.getProducts(filters).subscribe(
      (prods: any[]) => {
        this.myProducts = [...prods];
      },
      (error) => { }
    );
  }

  onFiltersApply(values: any) {
    const filters: ProductFilters = new ProductFilters();
    Object.keys(values).forEach(key => {
      switch (key) {
        case 'search':
          if (values[key] !== '') {
            filters[key] = values[key];
          }
          break;
        case 'productType':
          if (values[key] !== '') {
            filters[key] = this.enums.stringToType('productType', values[key]);
          }
          break;
      }
    });
    this.products.getProducts(filters).subscribe(
      (prods: any[]) => {
        this.myProducts = [...prods];
      },
      (error) => { }
    );
  }

  onProductDetailClick(id: string) {
    this.router.navigate(['main/product-detail', id], {state: {backURL: 'main/products-shop'}});
  }
}
