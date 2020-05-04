using API.Models.Enums;
using System;
using System.Collections.Generic;

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
        public ICollection<ImageDetail> Images { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
