using API.Models;
using API.Models.DTOs;
using API.Models.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

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

        public IdentityResult RegisterUser(RegisterUserDTO sent, DateTime? date = null)
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
                PhoneNumber = sent.PhoneNumber,
                Activity = new List<Activity> {
                    new Activity() {
                        Date = date.Value,
                        Type = ActivityType.AccountCreate,
                        Message = "Account created"
                    }
                },
                DateCreated = date.Value
            };

            return userManager.CreateAsync(user, sent.Password).Result;
        }

        public User UpdateUser(User user, DateTime? date = null)
        {
            if (date.HasValue == false)
            {
                date = DateTime.Now;
            }

            var storedUser = context.Users
                .Where(u => u.Id == user.Id)
                .Include(u => u.Activity)
                .FirstOrDefault();
            storedUser.FirstName = user.FirstName;
            storedUser.LastName = user.LastName;
            storedUser.PhoneNumber = user.PhoneNumber;
            storedUser.Activity.Add(new Activity()
            {
                Date = date.Value,
                Type = ActivityType.AccountUpdate,
                Message = "Account updated"
            });
            context.SaveChanges();

            return storedUser;
        }
    }
}
