export class DashDTO {
  Summary: DashSummaryDTO;
  Charts: DashChartsDTO;
}

export class DashSummaryDTO {
  Users: DashSummaryNewTotalDTO;
  Products: DashSummaryNewTotalDTO;
  Orders: DashSummaryNewTotalDTO;
}

export class DashSummaryNewTotalDTO {
  New: number;
  Total: number;
}

export class DashChartsDTO {
  Products: DashChartProductsDTO;
  Orders: DashChartOrdersDTO;
  Activity: DashChartActivityDTO;
}

export class DashChartProductsDTO {
  Goods: number;
  Services: number;
}

export class DashChartOrdersDTO {
  New: number;
  Completed: number;
  Cancelled: number;
}

export class DashChartActivityDTO {
  NewUsers: number[];
  NewProducts: number[];
  NewOrders: number[];
  CompletedOrders: number[];
  CancelledOrders: number[];
}
