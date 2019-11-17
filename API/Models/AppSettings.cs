using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class AppSettings
    {
        public string JWT_Secret { get; set; }
        public string UI_Url { get; set; }
    }
}
