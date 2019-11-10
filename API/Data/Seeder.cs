using API.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace API.Data
{
    public class Seeder
    {
        private readonly EFContext context;
        private readonly UserManager<User> userManager;

        public Seeder(EFContext context, UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        public async Task SeedAsync()
        {
            User user = await userManager.FindByEmailAsync("valens@admin.com");
            if (user == null) {
                user = new User()
                {
                    UserName = "valens@admin.com",
                    FirstName = "Valentin",
                    LastName = "S",
                    Email = "valens@admin.com"
                };
                var result = await userManager.CreateAsync(user, "adminPass!7");
                if (result != IdentityResult.Success) {
                    throw new InvalidOperationException("Seeder: Could not create new user");
                }
            }
        }
    }
}
