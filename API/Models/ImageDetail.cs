using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class ImageDetail
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public byte[] Image { get; set; }
        public Guid? ProductId { get; set; }
    }
}
