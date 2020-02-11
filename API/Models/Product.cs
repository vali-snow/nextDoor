using API.Models.Enums;
using System;

namespace API.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public ProductStatus Status { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ProductType Type { get; set; }
        public int Quantity { get; set; }
        public User Owner { get; set; }
    }
}
