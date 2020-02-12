import { Injectable } from '@angular/core';
import { OrderStatus } from 'src/models/enums/order.status.enum';
import { ProductType } from 'src/models/enums/product.type.enum';
import { ProductStatus } from 'src/models/enums/product.status.enum';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  constructor() { }

  typeToString(enumStr: string, num: number): string {
    let enumObj;
    switch (enumStr) {
      case 'orderStatus':
        enumObj = OrderStatus;
        break;
      case 'productStatus':
        enumObj = ProductStatus;
        break;
      case 'productType':
        enumObj = ProductType;
        break;
    }
    return enumObj[num];
  }

  stringToType(enumStr: string, str: string): number {
    let enumObj;
    switch (enumStr) {
      case 'orderStatus':
        enumObj = OrderStatus;
        break;
      case 'productStatus':
        enumObj = ProductStatus;
        break;
      case 'productType':
        enumObj = ProductType;
        break;
    }
    return enumObj[str];
  }

  getKeysFromEnum(enumStr: string): { code: string, des: string }[] {
    const keys = Object.keys;
    let enumObj;
    switch (enumStr) {
      case 'orderStatus':
        enumObj = OrderStatus;
        break;
      case 'productStatus':
        enumObj = ProductStatus;
        break;
      case 'productType':
        enumObj = ProductType;
        break;
    }
    const values: { code: string, des: string }[] = [];
    keys(enumObj).filter(key => parseInt(key, 10) >= 0).forEach(key => {
      values.push({ code: key, des: enumObj[key] });
    });

    return values;
  }
}
