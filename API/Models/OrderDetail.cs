using System;

namespace API.Models
{
    public class OrderDetail
    {
        public Guid Id { get; set; }
        public ImageDetail? ProductImage { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactAddress { get; set; }
    }
}
