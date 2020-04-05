import { ProductType } from './enums/product.type.enum';
import { User } from './user.model';
import { ProductStatus } from './enums/product.status.enum';
import { ImageDetail } from './imagedetail.model';

export class Product {
  Id?: string;
  Status: ProductStatus;
  Name: string;
  Description: string;
  Type: ProductType;
  Quantity: number;
  Images: ImageDetail[];
  Owner?: User;
}
