using API.Models;
using API.Models.DTOs;
using API.Models.Enums;
using Microsoft.AspNetCore.DataProtection;
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
        private readonly IDataProtector protector;

        public UsersEngine(EFContext context, UserManager<User> userManager, IDataProtectionProvider protectionProvider)
        {
            this.context = context;
            this.userManager = userManager;
            this.protector = protectionProvider.CreateProtector("luckyNumber7");
        }

        public UserDTO GetUser(Guid id)
        {
            return context.Users
                .AsNoTracking()
                .Where(u => u.Id == id.ToString())
                .Include(u => u.Activity)
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    FirstName = protector.Unprotect(u.FirstName),
                    LastName = protector.Unprotect(u.LastName),
                    Email = u.Email,
                    PhoneNumber = protector.Unprotect(u.PhoneNumber),
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
                FirstName = protector.Protect(sent.FirstName),
                LastName = protector.Protect(sent.LastName),
                Email = sent.Email,
                PhoneNumber = protector.Protect(sent.PhoneNumber),
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
            storedUser.FirstName = protector.Protect(user.FirstName);
            storedUser.LastName = protector.Protect(user.LastName);
            storedUser.PhoneNumber = protector.Protect(user.PhoneNumber);
            storedUser.Activity.Add(new Activity()
            {
                Date = date.Value,
                Type = ActivityType.AccountUpdate,
                Message = "Account updated"
            });
            context.SaveChanges();

            return user;
        }
    }
}
