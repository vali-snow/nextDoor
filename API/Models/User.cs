using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace API.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public ICollection<Activity> Activity { get; set;}
        public DateTime DateCreated { get; set; }
    }
}
