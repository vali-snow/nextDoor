import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnumService } from 'src/app/core/service/enum.service';
import { ProductsService } from './products.service';
import { ProductFilters } from 'src/models/filters/product.filters.model';

@Component({
  templateUrl: './productsHub.component.html',
  styleUrls: ['./productsHub.component.css']
})
export class ProductsHubComponent implements OnInit {
  myProducts = [];

  constructor(private products: ProductsService, private enums: EnumService) { }

  ngOnInit() {
    const filters = {
      isOwner: true
    } as ProductFilters;
    this.products.getProducts(filters).subscribe(
      (data: any[]) => {
        this.myProducts = [...data];
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
}
