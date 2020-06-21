using API.Engines;
using API.Models;
using API.Models.Enums;
using API.Models.Resources;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Data
{
    public class Seeder
    {
        private readonly EFContext context;
        private readonly UsersEngine uEngine;
        private readonly ProductsEngine pEngine;
        private readonly OrdersEngine oEngine;
        public Seeder(EFContext context, UsersEngine uEngine, ProductsEngine pEngine, OrdersEngine oEngine)
        {
            this.context = context;
            this.uEngine = uEngine;
            this.pEngine = pEngine;
            this.oEngine = oEngine;
        }

        public void Seed()
        {
            SeedUsers();
            SeedProductsAndOrders();
        }

        private void SeedUsers()
        {
            if (context.Users.Count() == 0)
            {
                var uRegister = new List<IdentityResult>() {
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Valentin", LastName = "Sarghi", Email = "valentin.sarghi@gmail.com", PhoneNumber = "0770397736", Password = "111" }, DateTime.Today.AddDays(-9)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Clarence", LastName = "Charlton", Email = "Clarence.Charlton@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-8)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Kairon", LastName = "Lester", Email = "Kairon.Lester@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-8)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Gemma", LastName = "Ferreira", Email = "Gemma.Ferreira@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-6)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Misbah", LastName = "Hanson", Email = "Misbah.Hanson@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-6)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Donte", LastName = "Sykes", Email = "Donte.Sykes@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-6)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Tyler", LastName = "Rasmussen", Email = "Tyler.Rasmussen@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-5)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Kiya", LastName = "Montoya", Email = "Kiya.Montoya@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-5)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Bradley", LastName = "Shea", Email = "Bradley.Shea@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-5)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Sania", LastName = "Holden", Email = "Sania.Holden@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-3)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Kerri", LastName = "Robles", Email = "Kerri.Robles@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-3)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Tessa", LastName = "Sparrow", Email = "Tessa.Sparrow@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-3)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Khloe", LastName = "Correa", Email = "Khloe.Correa@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-3)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Reef", LastName = "Frank", Email = "Reef.Frank@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-2)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Bobbie", LastName = "Hall", Email = "Bobbie.Hall@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-1)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Damian", LastName = "Dale", Email = "Damian.Dale@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today.AddDays(-1)),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Lorena", LastName = "Lovell", Email = "Lorena.Lovell@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Kelly", LastName = "Chung", Email = "Kelly.Chung@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Charlton", LastName = "Hendricks", Email = "Charlton.Hendricks@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Rubie", LastName = "Gill", Email = "Rubie.Gill@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today),
                    uEngine.RegisterUser(new RegisterUserDTO() { FirstName = "Thiago", LastName = "Gonzalez", Email = "Thiago.Gonzalez@email.com", PhoneNumber = "0770111111", Password = "111" }, DateTime.Today),
                };

                if (uRegister.Any(registration => registration.Succeeded != true))
                {
                    throw new InvalidOperationException("Seeder: Error while creating users");
                }
            }

        }

        private void SeedProductsAndOrders()
        {
            if (context.Products.Count() == 0)
            {
                // Seed Products
                var userValentin = uEngine.GetUser("valentin.sarghi@gmail.com");
                var userClarence = uEngine.GetUser("Clarence.Charlton@email.com");
                var userKairon = uEngine.GetUser("Kairon.Lester@email.com");
                var userGemma = uEngine.GetUser("Gemma.Ferreira@email.com");
                var userMisbah = uEngine.GetUser("Misbah.Hanson@email.com");
                var userDonte = uEngine.GetUser("Donte.Sykes@email.com");
                var userTyler = uEngine.GetUser("Tyler.Rasmussen@email.com");
                var userKiya = uEngine.GetUser("Kiya.Montoya@email.com");
                var userBradley = uEngine.GetUser("Bradley.Shea@email.com");
                var userSania = uEngine.GetUser("Sania.Holden@email.com");
                var userKerri = uEngine.GetUser("Kerri.Robles@email.com");
                var userTessa = uEngine.GetUser("Tessa.Sparrow@email.com");
                var userKhloe = uEngine.GetUser("Khloe.Correa@email.com");
                var userReef = uEngine.GetUser("Reef.Frank@email.com");
                var userBobbie = uEngine.GetUser("Bobbie.Hall@email.com");
                var userDamian = uEngine.GetUser("Damian.Dale@email.com");
                var userLorena = uEngine.GetUser("Lorena.Lovell@email.com");
                var userKelly = uEngine.GetUser("Kelly.Chung@email.com");
                var userCharlton = uEngine.GetUser("Charlton.Hendricks@email.com");
                var userRubie = uEngine.GetUser("Rubie.Gill@email.com");
                var userThiago = uEngine.GetUser("Thiago.Gonzalez@email.com");

                string jsonString;
                ProductResource product;

                jsonString = System.IO.File.ReadAllText(@".\Data\productChicken.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productChicken = pEngine.PostProduct(
                    userClarence,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-8)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productCurd.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productCurd = pEngine.PostProduct(
                    userKairon,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-7)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productHoney.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productHoney = pEngine.PostProduct(
                    userGemma,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-6)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productApplePie.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productApplePie = pEngine.PostProduct(
                    userMisbah,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-6)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productSweetBread.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productSweetBread = pEngine.PostProduct(
                    userDonte,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-6)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productGreenSpaceMaintenance.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productGreenSpaceMaintenance = pEngine.PostProduct(
                    userValentin,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-9)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productBread.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productBread = pEngine.PostProduct(
                    userTyler,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-5)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productCabbageVineRolls.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productCabbageVineRolls = pEngine.PostProduct(
                    userKiya,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-4)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productStrawberries.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productStrawberries = pEngine.PostProduct(
                    userBradley,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-3)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productFilledNutsCookies.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productFilledNutsCookies = pEngine.PostProduct(
                    userSania,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-3)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productGardenSet.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productGardenSet = pEngine.PostProduct(
                    userKerri,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-3)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productNailSaloon.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productNailSaloon = pEngine.PostProduct(
                    userTessa,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-2)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productFriedChicken.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productFriedChicken = pEngine.PostProduct(
                    userKhloe,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-1)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productCleanupServices.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productCleanupServices = pEngine.PostProduct(
                    userReef,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-1)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productLandscaping.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productLandscaping = pEngine.PostProduct(
                    userBobbie,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-1)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productFlowerBouquets.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productFlowerBouquets = pEngine.PostProduct(
                    userDamian,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today.AddDays(-1)
                );

                jsonString = System.IO.File.ReadAllText(@".\Data\productTomatoSeedlings.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productTomatoSeedlings = pEngine.PostProduct(
                    userLorena,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today
                );
                
                jsonString = System.IO.File.ReadAllText(@".\Data\productMiniHouse.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productMiniHouse = pEngine.PostProduct(
                    userKelly,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today
                );
                
                jsonString = System.IO.File.ReadAllText(@".\Data\productStrawberryCake.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productStrawberryCake = pEngine.PostProduct(
                    userCharlton,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today
                );
                
                jsonString = System.IO.File.ReadAllText(@".\Data\productGirlHeadbands.json");
                product = JsonConvert.DeserializeObject<ProductResource>(jsonString);
                var productGirlHeadbands = pEngine.PostProduct(
                    userRubie,
                    new Product() { Name = product.Name, Type = product.Type, Quantity = product.Quantity, Price = product.Price, Description = product.Description },
                    product.Images.Select(i => new ImageDetail()
                    {
                        Description = i.Description,
                        Type = i.Type,
                        Image = Convert.FromBase64String(i.Image)
                    }).ToList(),
                    DateTime.Today
                );

                //Seed Orders
                // To fulfill admin
                var orderGreenSpaceMaintenance1 = oEngine.PlaceOrder(userClarence, new Models.DTOs.OrderDTO() {
                    ProductId = productGreenSpaceMaintenance.Id,
                    Quantity = 1,
                    ContactName = $"{userClarence.FirstName} {userClarence.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today.AddDays(-8));
                var orderGreenSpaceMaintenance2 = oEngine.PlaceOrder(userKairon, new Models.DTOs.OrderDTO() {
                    ProductId = productGreenSpaceMaintenance.Id,
                    Quantity = 1,
                    ContactName = $"{userKairon.FirstName} {userKairon.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today.AddDays(-7));
                var orderGreenSpaceMaintenance3 = oEngine.PlaceOrder(userGemma, new Models.DTOs.OrderDTO() {
                    ProductId = productGreenSpaceMaintenance.Id,
                    Quantity = 1,
                    ContactName = $"{userGemma.FirstName} {userGemma.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today.AddDays(-6));
                var orderGreenSpaceMaintenance4 = oEngine.PlaceOrder(userMisbah, new Models.DTOs.OrderDTO() {
                    ProductId = productGreenSpaceMaintenance.Id,
                    Quantity = 1,
                    ContactName = $"{userMisbah.FirstName} {userMisbah.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today.AddDays(-6));
                var orderGreenSpaceMaintenance5 = oEngine.PlaceOrder(userDonte, new Models.DTOs.OrderDTO()
                {
                    ProductId = productGreenSpaceMaintenance.Id,
                    Quantity = 1,
                    ContactName = $"{userDonte.FirstName} {userDonte.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today.AddDays(-5));
                var orderGreenSpaceMaintenance6 = oEngine.PlaceOrder(userTyler, new Models.DTOs.OrderDTO()
                {
                    ProductId = productGreenSpaceMaintenance.Id,
                    Quantity = 1,
                    ContactName = $"{userTyler.FirstName} {userTyler.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today.AddDays(-4));

                oEngine.CompleteOrder(userValentin, orderGreenSpaceMaintenance1.Id, DateTime.Today.AddDays(-7));
                oEngine.CompleteOrder(userValentin, orderGreenSpaceMaintenance2.Id, DateTime.Today.AddDays(-6));
                oEngine.CompleteOrder(userValentin, orderGreenSpaceMaintenance3.Id, DateTime.Today.AddDays(-5));
                oEngine.CancelOrder(userMisbah, orderGreenSpaceMaintenance4.Id, "No longer required", DateTime.Today.AddDays(-5));

                // To receive admin
                var orderChicken = oEngine.PlaceOrder(userValentin, new Models.DTOs.OrderDTO()
                {
                    ProductId = productChicken.Id,
                    Quantity = 2,
                    ContactName = $"{userValentin.FirstName} {userValentin.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today.AddDays(-3));
                var orderApplePie = oEngine.PlaceOrder(userValentin, new Models.DTOs.OrderDTO()
                {
                    ProductId = productApplePie.Id,
                    Quantity = 1,
                    ContactName = $"{userValentin.FirstName} {userValentin.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today.AddDays(-3));
                var orderFriedChicken = oEngine.PlaceOrder(userValentin, new Models.DTOs.OrderDTO()
                {
                    ProductId = productFriedChicken.Id,
                    Quantity = 1,
                    ContactName = $"{userValentin.FirstName} {userValentin.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today.AddDays(-1));
                var orderFlowerBouquets = oEngine.PlaceOrder(userValentin, new Models.DTOs.OrderDTO()
                {
                    ProductId = productFlowerBouquets.Id,
                    Quantity = 1,
                    ContactName = $"{userValentin.FirstName} {userValentin.LastName}",
                    ContactAddress = "Ethernet Str.",
                    ContactPhone = "0770111111"
                }, DateTime.Today);
            }
        }
    }
}
