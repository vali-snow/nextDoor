import { Product } from './product.model';

export class ImageDetail {
  Id?: string;
  Description?: string;
  Image: File;
  ProductId?: string;
  Product?: Product;
}
