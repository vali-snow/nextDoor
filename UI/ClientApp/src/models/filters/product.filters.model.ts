import { ProductType } from '../enums/product.type.enum';

export class ProductFilters {
  isOwner?: boolean = null;
  search?: string = null;
  productType?: ProductType = null;
}
