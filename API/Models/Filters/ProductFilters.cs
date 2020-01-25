using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Filters
{
    public class ProductFilters
    {
        public bool? IsOwner { get; set; } = null;
        public ProductType? ProductType { get; set; } = null;
        public DateTime? StartDate { get; set; } = null;
        public DateTime? EndDate { get; set; } = null;
    }
}
