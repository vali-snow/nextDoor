using API.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
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
            await SeedUsers();
            await SeedProducts();
            await SeedOrders();
        }

        private async Task SeedUsers()
        {
            if (userManager.Users.Count() == 0)
            {
                var admin = await userManager.FindByEmailAsync("valens@admin.com");
                if (admin == null)
                {
                    admin = new User() { UserName = "valens@admin.com", FirstName = "valen", LastName = "s", Email = "valens@admin.com", PhoneNumber = "0770777777" };
                    var result = await userManager.CreateAsync(admin, "111");
                    if (result != IdentityResult.Success)
                    {
                        throw new InvalidOperationException("Seeder: Could not create admin");
                    }
                }

                var user1 = await userManager.FindByEmailAsync("bot1@user.com");
                if (user1 == null)
                {
                    user1 = new User() { UserName = "bot1@user.com", FirstName = "one", LastName = "bot", Email = "bot1@user.com", PhoneNumber = "0770111111" };
                    var result = await userManager.CreateAsync(user1, "111");
                    if (result != IdentityResult.Success)
                    {
                        throw new InvalidOperationException("Seeder: Could not create user1");
                    }
                }

                var user2 = await userManager.FindByEmailAsync("bot2@user.com");
                if (user2 == null)
                {
                    user2 = new User() { UserName = "bot2@user.com", FirstName = "two", LastName = "bot", Email = "bot2@user.com", PhoneNumber = "0770222222" };
                    var result = await userManager.CreateAsync(user2, "222");
                    if (result != IdentityResult.Success)
                    {
                        throw new InvalidOperationException("Seeder: Could not create user2");
                    }
                }
            }
        }

        private async Task SeedProducts()
        {
            if (context.Products.Count() == 0)
            {
                User user = await userManager.FindByEmailAsync("valens@admin.com");
                var products = new List<Product>()
                {
                    new Product() { Name = "G1 Name", Description = "G1 Description", Type = ProductType.Good, Owner = user, Quantity = 1 },
                    new Product() { Name = "G2 Name", Description = "G2 Description", Type = ProductType.Good, Owner = user, Quantity = 2 },
                    new Product() { Name = "G3 Name", Description = "G3 Description", Type = ProductType.Good, Owner = user, Quantity = 3 },
                    new Product() { Name = "G4 Name", Description = "G4 Description", Type = ProductType.Good, Owner = user, Quantity = 4 },
                    new Product() { Name = "G5 Name", Description = "G5 Description", Type = ProductType.Good, Owner = user, Quantity = 5 },
                    new Product() { Name = "G6 Name", Description = "G6 Description", Type = ProductType.Good, Owner = user, Quantity = 6 },
                    new Product() { Name = "G7 Name", Description = "G7 Description", Type = ProductType.Good, Owner = user, Quantity = 7 },
                    new Product() { Name = "G8 Name", Description = "G8 Description", Type = ProductType.Good, Owner = user, Quantity = 8 },
                    new Product() { Name = "G9 Name", Description = "G9 Description", Type = ProductType.Good, Owner = user, Quantity = 9 },
                    new Product() { Name = "G10 Name", Description = "G10 Description", Type = ProductType.Good, Owner = user, Quantity = 10 },
                    new Product() { Name = "S1 Name", Description = "S1 Description", Type = ProductType.Service, Owner = user },
                    new Product() { Name = "S2 Name", Description = "S2 Description", Type = ProductType.Service, Owner = user },
                    new Product() { Name = "S3 Name", Description = "S3 Description", Type = ProductType.Service, Owner = user },
                };
                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }

        private async Task SeedOrders()
        {
            if (context.Orders.Count() == 0)
            {
                var user1 = await userManager.FindByEmailAsync("bot1@user.com");
                var user2 = await userManager.FindByEmailAsync("bot2@user.com");

                var product1 = context.Products.Where(p1 => p1.Name == "G7 Name").FirstOrDefault();
                if (product1 != null)
                {
                    var orders1 = new List<Order>()
                    {
                        new Order () { Product = product1, Quantity = 2, Status = OrderStatus.New, DeliverToUser = user1, DeliverToAddress = "Address 1", DeliverToPhoneNumber = "0770111111", StartDate = DateTime.UtcNow },
                        new Order () { Product = product1, Quantity = 1, Status = OrderStatus.New, DeliverToUser = user2, DeliverToAddress = "Address 2", DeliverToPhoneNumber = "0770222222", StartDate = DateTime.UtcNow }
                    };
                    context.Orders.AddRange(orders1);
                }

                var product2 = context.Products.Where(p1 => p1.Name == "S1 Name").FirstOrDefault();
                if (product2 != null)
                {
                    var orders2 = new List<Order>()
                    {
                        new Order () { Product = product2, Quantity = 1, Status = OrderStatus.New, DeliverToUser = user1, DeliverToAddress = "Address 1", DeliverToPhoneNumber = "0770111111", StartDate = DateTime.UtcNow },
                        new Order () { Product = product2, Quantity = 1, Status = OrderStatus.New, DeliverToUser = user2, DeliverToAddress = "Address 2", DeliverToPhoneNumber = "0770222222", StartDate = DateTime.UtcNow }
                    };
                    context.Orders.AddRange(orders2);
                }

                context.SaveChanges();
            }
        }
    }
}
