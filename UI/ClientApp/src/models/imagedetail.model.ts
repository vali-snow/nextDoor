import { Product } from './product.model';

export class ImageDetail {
  Id?: string;
  Description?: string;
  Type?: string;
  Image: File;
  ProductId?: string;
  Product?: Product;
}
