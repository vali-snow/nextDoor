import { Component, OnInit } from '@angular/core';
import { EnumService } from 'src/app/core/service/enum.service';
import { ProductsService } from './products.service';
import { FilterModel } from 'src/models/filters/filter.model';
import { ProductFilters } from 'src/models/filters/product.filters.model';
import { MatDialog } from '@angular/material';
import { Product } from 'src/models/product.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Image9DialogComponent } from '../common/image9/dialog/image9-dialog.component';
import { OrdersService } from '../orders/orders.service';

@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  userId: string;
  filterModel: FilterModel = {
    title: this.route.snapshot.data.title,
    description: 'Filter Panel',
    array: {
      search: { label: 'Search', type: 'text', size: 80 },
      productType: { label: 'Product Type', type: 'select', size: 20, options: this.enums.getKeysFromEnum('productType') }
    }
  };

  constructor(private productsService: ProductsService, private ordersService: OrdersService,
              private enums: EnumService, public dialog: MatDialog,
              private route: ActivatedRoute, private router: Router) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    this.products = this.route.snapshot.data.products;
  }

  onFiltersApply(values: any) {
    const filters = this.createFiltersObj(values);
    this.productsService.getProducts(filters).subscribe(
      (prods: any[]) => {
        this.products = [...prods];
      },
      (error) => { }
    );
  }

  onProductDetailClick(id: string) {
    const show = this.route.snapshot.data.show;
    switch (show) {
      case 'all':
        this.router.navigate(['main/product-detail', id], { state: { backURL: 'main/products-all' } });
        break;
      case 'mine':
        this.router.navigate(['main/product-detail', id], { state: { backURL: 'main/products-shop' } });
        break;
    }
  }

  onProductOrderClick(product: Product) {
    this.productsService.orderProductPopup(product);
  }

  onGetSafeLogoURL(prod: Product): string {
    return this.productsService.getSafeLogoURL(prod);
  }

  onImageClick(product: Product) {
    const images = this.productsService.getProductImages(product);
    this.dialog.open(Image9DialogComponent, {
      width: '806px',
      data: {
        images: images,
        index: 0
      }
    });
  }

  createFiltersObj(values: any): ProductFilters {
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
    if (this.route.snapshot.data.show === 'mine') {
      filters.isOwner = true;
    }
    return filters;
  }
}
