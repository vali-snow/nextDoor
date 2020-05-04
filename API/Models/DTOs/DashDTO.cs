using System.Collections.Generic;

namespace API.Models.DTOs
{
    public class DashDTO
    {
        public DashSummaryDTO Summary { get; set; }
        public DashChartsDTO Charts { get; set; }

    }

    public class DashSummaryDTO
    {
        public DashSummaryNewTotalDTO Users { get; set; }
        public DashSummaryNewTotalDTO Products { get; set; }
        public DashSummaryNewTotalDTO Orders { get; set; }
    }

    public class DashSummaryNewTotalDTO
    {
        public int New { get; set; }
        public int Total { get; set; }
    }

    public class DashChartsDTO
    {
        public DashChartProductsDTO Products { get; set; }
        public DashChartOrdersDTO Orders { get; set; }
        public DashChartActivityDTO Activity { get; set; }
    }

    public class DashChartProductsDTO
    {
        public int Goods { get; set; }
        public int Services { get; set; }
    }

    public class DashChartOrdersDTO
    {
        public int New { get; set; }
        public int Completed { get; set; }
        public int Cancelled { get; set; }
    }

    public class DashChartActivityDTO
    {
        public ICollection<int> NewUsers { get; set; }
        public ICollection<int> NewProducts { get; set; }
        public ICollection<int> NewOrders { get; set; }
        public ICollection<int> CompletedOrders { get; set; }
        public ICollection<int> CancelledOrders { get; set; }
    }
}
