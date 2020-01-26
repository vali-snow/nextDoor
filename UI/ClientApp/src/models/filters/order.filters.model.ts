import { OrderType } from '../enums/order.type.enum';
import { OrderStatus } from '../enums/order.status.enum';
import { ProductType } from '../enums/product.type.enum';

export class OrderFilters {
  orderType?: OrderType = null;
  orderStatus?: OrderStatus = null;
  productType?: ProductType = null;
  date?: {start: Date, end: Date} = null;
}
