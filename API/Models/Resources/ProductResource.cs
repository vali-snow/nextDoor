using System.Collections.Generic;

namespace API.Models.Resources
{
    public class ProductResource
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ProductType Type { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public IList<ImageResource> Images { get; set; }
    }
}
