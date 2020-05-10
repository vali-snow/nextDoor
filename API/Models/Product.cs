using API.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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
        [RegularExpression(@"^\d+\.\d{0,2}$")]
        [Range(0, 9999999999999.99)]
        public double Price { get; set; }
        public User Owner { get; set; }
        public ICollection<ImageDetail> Images { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
