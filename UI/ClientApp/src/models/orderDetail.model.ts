import { ImageDetail } from "./imagedetail.model";

export class OrderDetail {
  Id?: string;
  ProductImage?: ImageDetail;
  ContactName: string;
  ContactPhone: string;
  ContactAddress: string;
}
