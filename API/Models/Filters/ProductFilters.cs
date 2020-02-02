using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Filters
{
    public class ProductFilters
    {
        public bool? IsOwner { get; set; } = null;
        public string? Search { get; set; } = null;
        public ProductType? ProductType { get; set; } = null;
    }
}
