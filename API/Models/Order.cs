using System;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        [RegularExpression(@"^\d+\.\d{0,2}$")]
        [Range(0, 9999999999999.99)]
        public double Total { get; set; }
        public OrderStatus? Status { get; set; }
        public User? Seller { get; set; }
        public User? Buyer { get; set; }
        public OrderDetail AdditionalDetail { get; set;}
        public DateTime DatePlaced { get; set; }
        public DateTime? DateCompleted { get; set; }
        public string? CompletedBy { get; set; }
        public DateTime? DateCancelled { get; set; }
        public string? CancelledBy { get; set; }
        public string? ReasonCancelled { get; set; }
    }
}
