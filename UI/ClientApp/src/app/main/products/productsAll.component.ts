import { Component, OnInit } from '@angular/core';
import { EnumService } from 'src/app/core/service/enum.service';
import { ProductsService } from './products.service';
import { FilterModel } from 'src/models/filters/filter.model';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

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
    // formGroup: new FormGroup({
      
    // })
  };

  constructor(private products: ProductsService, private enums: EnumService) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    this.products.getProducts().subscribe(
      (data: any[]) => {
        this.allProducts = [...data];
      },
      (error) => { }
    );
  }

  onFilterApplyClick(id: string) {
    alert(id);
  }

  onFilterClearClick(id: string) {
    alert(id);
  }

  onProductDetailClick(id: string) {
    alert(id);
  }

  onProductOrderClick(id: string) {
    alert(id);
  }
}
