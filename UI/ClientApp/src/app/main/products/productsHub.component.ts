import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderStatus } from 'src/models/enums/orderstatus.enum';
import { ProductType } from 'src/models/enums/producttype.enums';

@Component({
  templateUrl: './productsHub.component.html',
  styleUrls: ['./productsHub.component.css']
})
export class ProductsHubComponent implements OnInit {
  myProducts = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://localhost:44377/api/Products/', { params: {'isOwner': 'true'}}).subscribe(
      (data: any[]) => {
        this.myProducts = [...data];
      },
      (error) => {
        // if (error.status === 400) {
        //   this.toastr.error(error.error.message, 'Login failed');
        // } else {
        //   console.log(error);
        // }
      }
    );
  }

  typeToString(enumStr: string, num: number) {
    let enumObj;
    switch (enumStr) {
      case 'statuses':
        enumObj = OrderStatus;
        break;
      case 'types':
        enumObj = ProductType;
        break;
    }
    return enumObj[num];
  }

  getKeysFromEnum(enumStr: string) {
    const keys = Object.keys;
    let enumObj;
    switch (enumStr) {
      case 'statuses':
        enumObj = OrderStatus;
        break;
      case 'types':
        enumObj = ProductType;
        break;
    }
    const values = [];
    keys(enumObj).filter(key => parseInt(key, 10) >= 0).forEach(key => {
      values.push({ 'code': key, 'des': enumObj[key] });
    });

    return values;
  }

  onProductDetailClick(id: string) {
    alert(id);
  }

}
