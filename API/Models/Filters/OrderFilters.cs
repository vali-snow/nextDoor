using API.Models.Enums;
using System;

namespace API.Models.Filters
{
    public class OrderFilters
    {
        public OrderType? OrderType { get; set; } = null;
        public ProductType? ProductType { get; set; } = null;
        public OrderStatus? OrderStatus { get; set; } = null;

        public DateInterval? Date { get; set; } = null;

    }
}
