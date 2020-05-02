using API.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class Activity
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public ActivityType Type { get; set; }
        public string Message { get; set; }
        public Guid? Reference { get; set; }
    }
}
