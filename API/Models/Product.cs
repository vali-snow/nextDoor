using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ProductType Type { get; set; }
        public int Quantity { get; set; }
        public User Owner { get; set; }
        //public List<Image> Images { get; set; }
    }
}
