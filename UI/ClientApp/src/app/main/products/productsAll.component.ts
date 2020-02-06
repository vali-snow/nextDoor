import { Component, OnInit } from '@angular/core';
import { EnumService } from 'src/app/core/service/enum.service';
import { ProductsService } from './products.service';
import { FilterModel } from 'src/models/filters/filter.model';
import { ProductFilters } from 'src/models/filters/product.filters.model';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../common/dialog/dialog.component';

@Component({
  templateUrl: './productsAll.component.html',
  styleUrls: ['./productsAll.component.css']
})
export class ProductsAllComponent implements OnInit {
  allProducts = [];
  userId: string;
  filterModel: FilterModel = {
    title: 'All Products',
    description: 'Filter Panel',
    array: {
      search: { label: 'Search', type: 'text', size: 80 },
      productType: { label: 'Product Type', type: 'select', size: 20, options: this.enums.getKeysFromEnum('productType') }
    }
  };

  constructor(private products: ProductsService, private enums: EnumService, public dialog: MatDialog) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    this.products.getProducts().subscribe(
      (prods: any[]) => {
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
    const product = this.allProducts.filter(prod => prod.id = id)[0];
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '80%',
      data: {
        title: 'Product Detail',
        product,
        dynamic: {
          filters: [
            [
              {
                key: 'search1',
                label: 'Search1',
                type: 'text',
                size: '80',
                options: null,
                value: 'test1'
              },
              {
                key: 'search2',
                label: 'Search2',
                type: 'text',
                size: '20',
                options: null,
                value: 'test2'
              }
            ],
            [
              {
                key: null,
                label: null,
                type: 'placeholder',
                size: '10',
                options: null,
                value: null
              },
              {
                key: 'search3',
                label: 'Search3',
                type: 'text',
                size: '90',
                options: null,
                value: 'test3'
              }
            ]
          ],
          buttons: [
            {
              key: '1',
              label: 'First'
            },
            {
              key: '2',
              label: 'Second'
            }
          ]
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onProductOrderClick(id: string) {
    alert(id);
  }
}
