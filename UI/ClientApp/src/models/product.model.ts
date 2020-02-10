import { ProductType } from './enums/product.type.enum';
import { User } from './user.model';

export class Product {
  Id?: string;
  Name: string;
  Description: string;
  Type: ProductType;
  Quantity: number;
  Owner?: User;
}
