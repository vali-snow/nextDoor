using API.Models;
using API.Models.DTOs;
using API.Models.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Engines
{
    public class UsersEngine
    {
        private EFContext context;
        private readonly UserManager<User> userManager;
        private readonly AppSettings appSettings;
        public UsersEngine(EFContext context, UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        public UserDTO GetUser(Guid id)
        {
            return context.Users
                .Where(u => u.Id == id.ToString())
                .Include(u => u.Activity)
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Activity = u.Activity
                })
                .FirstOrDefault();
        }

        public User GetUser(string email)
        {
            return context.Users
                .Where(u => u.Email == email)
                .Include(u => u.Activity)
                .FirstOrDefault();
        }

        public async Task<IdentityResult> RegisterUser(RegisterUserDTO sent, DateTime? date = null)
        {
            if (date.HasValue == false)
            {
                date = DateTime.Now;
            }

            var user = new User()
            {
                UserName = sent.Email,
                FirstName = sent.FirstName,
                LastName = sent.LastName,
                Email = sent.Email,
                Activity = new List<Activity> {
                    new Activity() {
                        Date = date.Value,
                        Type = ActivityType.AccountCreate,
                        Message = "Account created"
                    }
                },
                DateCreated = date.Value
            };

            return await userManager.CreateAsync(user, sent.Password);
        }
    }
}
