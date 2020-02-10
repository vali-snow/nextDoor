import { Component, OnInit } from '@angular/core';
import { EnumService } from 'src/app/core/service/enum.service';
import { ProductsService } from './products.service';
import { FilterModel } from 'src/models/filters/filter.model';
import { ProductFilters } from 'src/models/filters/product.filters.model';
import { MatDialog } from '@angular/material';
import { Product } from 'src/models/product.model';
import { Router } from '@angular/router';

@Component({
  templateUrl: './productsAll.component.html',
  styleUrls: ['./productsAll.component.css']
})
export class ProductsAllComponent implements OnInit {
  allProducts: Product[] = [];
  userId: string;
  filterModel: FilterModel = {
    title: 'All Products',
    description: 'Filter Panel',
    array: {
      search: { label: 'Search', type: 'text', size: 80 },
      productType: { label: 'Product Type', type: 'select', size: 20, options: this.enums.getKeysFromEnum('productType') }
    }
  };

  constructor(private products: ProductsService, private enums: EnumService, public dialog: MatDialog, private router: Router) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    this.products.getProducts().subscribe(
      (prods: Product[]) => {
        this.allProducts = [...prods];
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
        this.allProducts = [...prods];
      },
      (error) => { }
    );
  }

  onProductDetailClick(id: string) {
    this.router.navigate(['main/product-detail', id]);
  }

  onProductOrderClick(id: string) {
    alert(id);
  }
}
