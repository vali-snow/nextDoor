import { OrderStatus } from './enums/orderstatus.enum';
import { User } from './user.model';
import { Product } from './product.model';

export class Order {
  Id?: string;
  Product: Product;
  Quantity: number;
  Status: OrderStatus;
  DeliverToUser: User;
  DeliverToAddress: string;
  DeliveryToPhoneNumber: string;
  StartDate: Date;
  EndDate: Date;
}
