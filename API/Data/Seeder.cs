using API.Models;
using API.Models.Enums;
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
                var admin = await userManager.FindByEmailAsync("valens@admin.com");
                var user1 = await userManager.FindByEmailAsync("bot1@user.com");
                var user2 = await userManager.FindByEmailAsync("bot2@user.com");
                var products = new List<Product>()
                {
                    new Product() { Status = ProductStatus.Listed, Name = "G1 Name", Description = "G1 Description", Type = ProductType.Good, Owner = admin, Quantity = 1 },
                    new Product() { Status = ProductStatus.Listed, Name = "G2 Name", Description = "G2 Description", Type = ProductType.Good, Owner = admin, Quantity = 2 },
                    new Product() { Status = ProductStatus.Listed, Name = "G3 Name", Description = "G3 Description", Type = ProductType.Good, Owner = admin, Quantity = 3 },
                    new Product() { Status = ProductStatus.Listed, Name = "G4 Name", Description = "G4 Description", Type = ProductType.Good, Owner = user1, Quantity = 4 },
                    new Product() { Status = ProductStatus.Listed, Name = "G5 Name", Description = "G5 Description", Type = ProductType.Good, Owner = user1, Quantity = 5 },
                    new Product() { Status = ProductStatus.Listed, Name = "G6 Name", Description = "G6 Description", Type = ProductType.Good, Owner = user1, Quantity = 6 },
                    new Product() { Status = ProductStatus.Listed, Name = "G7 Name", Description = "G7 Description", Type = ProductType.Good, Owner = user2, Quantity = 7 },
                    new Product() { Status = ProductStatus.Listed, Name = "G8 Name", Description = "G8 Description", Type = ProductType.Good, Owner = user2, Quantity = 8 },
                    new Product() { Status = ProductStatus.Listed, Name = "G9 Name", Description = "G9 Description", Type = ProductType.Good, Owner = user2, Quantity = 9 },
                    new Product() { Status = ProductStatus.Listed, Name = "S1 Name", Description = "S1 Description", Type = ProductType.Service, Owner = admin },
                    new Product() { Status = ProductStatus.Listed, Name = "S2 Name", Description = "S2 Description", Type = ProductType.Service, Owner = user1 },
                    new Product() { Status = ProductStatus.Listed, Name = "S3 Name", Description = "S3 Description", Type = ProductType.Service, Owner = user2 },
                };
                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }

        private async Task SeedOrders()
        {
            if (context.Orders.Count() == 0)
            {
                var admin = await userManager.FindByEmailAsync("valens@admin.com");
                var user1 = await userManager.FindByEmailAsync("bot1@user.com");
                var user2 = await userManager.FindByEmailAsync("bot2@user.com");

                var product1 = context.Products.Where(p1 => p1.Name == "G1 Name").FirstOrDefault();
                if (product1 != null)
                {
                    var orders = new List<Order>()
                    {
                        new Order ()
                        {
                            Product = product1, Quantity = 2, Status = OrderStatus.New, Seller = product1.Owner, Buyer = user1, DatePlaced = DateTime.UtcNow,
                            AdditionalDetail = new OrderDetail { ContactName = "user3", ContactPhone = "0770333333", ContactAddress = "Str. X3" }
                        },
                        new Order ()
                        {
                            Product = product1, Quantity = 2, Status = OrderStatus.New, Seller = product1.Owner, Buyer = user2, DatePlaced = DateTime.UtcNow,
                            AdditionalDetail = new OrderDetail { ContactName = "user4", ContactPhone = "0770444444", ContactAddress = "Str. X4" }
                        },
                    };
                    context.Orders.AddRange(orders);
                }

                var product2 = context.Products.Where(p1 => p1.Name == "G4 Name").FirstOrDefault();
                if (product2 != null)
                {
                    var orders = new List<Order>()
                    {
                        new Order ()
                        {
                            Product = product2, Quantity = 2, Status = OrderStatus.New, Seller = product2.Owner, Buyer = admin, DatePlaced = DateTime.UtcNow,
                            AdditionalDetail = new OrderDetail { ContactName = "admin", ContactPhone = "0770777777", ContactAddress = "Str. X7" }
                        },
                        new Order ()
                        {
                            Product = product2, Quantity = 2, Status = OrderStatus.New, Seller = product2.Owner, Buyer = user2, DatePlaced = DateTime.UtcNow,
                            AdditionalDetail = new OrderDetail { ContactName = "user4", ContactPhone = "0770444444", ContactAddress = "Str. X4" }
                        },
                    };
                    context.Orders.AddRange(orders);
                }

                var product3 = context.Products.Where(p1 => p1.Name == "G7 Name").FirstOrDefault();
                if (product3 != null)
                {
                    var orders = new List<Order>()
                    {
                        new Order ()
                        {
                            Product = product3, Quantity = 2, Status = OrderStatus.New, Seller = product3.Owner, Buyer = admin, DatePlaced = DateTime.UtcNow,
                            AdditionalDetail = new OrderDetail { ContactName = "admin", ContactPhone = "0770777777", ContactAddress = "Str. X7" }
                        },
                        new Order ()
                        {
                            Product = product3, Quantity = 2, Status = OrderStatus.New, Seller = product3.Owner, Buyer = user2, DatePlaced = DateTime.UtcNow,
                            AdditionalDetail = new OrderDetail { ContactName = "user3", ContactPhone = "0770333333", ContactAddress = "Str. X3" }
                        },
                    };
                    context.Orders.AddRange(orders);
                }

                context.SaveChanges();
            }
        }
    }
}
