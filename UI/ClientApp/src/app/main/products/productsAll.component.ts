import { Component, OnInit } from '@angular/core';
import { OrderStatus } from 'src/models/enums/orderstatus.enum';
import { ProductType } from 'src/models/enums/producttype.enums';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './productsAll.component.html',
  styleUrls: ['./productsAll.component.css']
})
export class ProductsAllComponent implements OnInit {
  allProducts = [];
  userId: string;

  constructor(private http: HttpClient) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    this.http.get('https://localhost:44377/api/Products/').subscribe(
      (data: any[]) => {
        this.allProducts = [...data];
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
