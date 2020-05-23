import { OrderStatus } from './enums/order.status.enum';
import { User } from './user.model';
import { Product } from './product.model';
import { OrderDetail } from './orderDetail.model';

export class Order {
  Id?: string;
  Product: Product;
  Quantity: number;
  Total: number;
  Status?: OrderStatus;
  Seller?: User;
  Buyer?: User;
  AdditionalDetail: OrderDetail;
  DatePlaced: Date;
  DateCompleted?: Date;
  CompletedBy?: string;
  DateCancelled?: Date;
  CancelledBy?: string;
  ReasonCancelled?: string;
}
