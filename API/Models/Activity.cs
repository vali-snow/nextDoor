using API.Models.Enums;
using System;

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
