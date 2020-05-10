using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using System.Linq;
using System.Text.Json;
using API.Models.Resources;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly EFContext context;

        public ImagesController(EFContext context)
        {
            this.context = context;
        }

        // GET: api/PrepareForSeeder
        [HttpGet("PrepareForSeeder")]
        public IActionResult PrepareForSeeder()
        {
            var dict = new Dictionary<string, Guid>()
            {
                //{ "productChicken", new Guid("445b7153-470e-4ba5-eb12-08d7f39069e3") },
                //{ "productCurd", new Guid("f3e45fc8-540b-48da-eb13-08d7f39069e3") },
                //{ "productHoney", new Guid("5ded843b-c8a4-4429-eb14-08d7f39069e3") },
                //{ "productApplePie", new Guid("e5d5a545-b47c-4bdc-c50f-08d7f39463fb") },
                //{ "productSweetBread", new Guid("0c227ba6-270c-493f-c510-08d7f39463fb") },
                //{ "productGreenSpaceMaintenance", new Guid("c4b7a662-1ebd-47a9-8c09-08d7f3d72f28") },
                //{ "productBread", new Guid("654c4fa4-ca57-497d-ddf8-08d7f3d9013e") },
                //{ "productCabbageVineRolls", new Guid("c8a896b8-d271-4353-22b4-08d7f3dbd4ff") },
                //{ "productStrawberries", new Guid("f044ac9c-4d61-403e-2406-08d7f3dddaba") },
                //{ "productFilledNutsCookies", new Guid("29567ef8-9b46-454e-2407-08d7f3dddaba") },
                //{ "productGardenSet", new Guid("7b0a9042-8a58-45f9-d279-08d7f43bb7cc") },
                //{ "productNailSaloon", new Guid("fb1ce6db-05db-48e3-d27a-08d7f43bb7cc") },
                //{ "productFriedChicken", new Guid("1a6ed8f3-90e8-4e28-d27b-08d7f43bb7cc") },
                //{ "productCleanupServices", new Guid("e920493e-4b44-4ae1-d27c-08d7f43bb7cc") },
                //{ "productLandscaping", new Guid("76afd102-3116-43ad-d27d-08d7f43bb7cc") },
                //{ "productFlowerBouquets", new Guid("99b005e7-ec52-4c6b-ec00-08d7f4c1ad2d") },
                //{ "productTomatoSeedlings", new Guid("ff124235-2eee-4c69-ec01-08d7f4c1ad2d") },
                //{ "productMiniHouse", new Guid("472ee562-4a4f-4a62-ec02-08d7f4c1ad2d") },
                //{ "productStrawberryCake", new Guid("dc6970af-e4f1-497a-ec03-08d7f4c1ad2d") },
                //{ "productGirlHeadbands", new Guid("9de95adc-b731-41af-ec04-08d7f4c1ad2d") }
            };

            foreach (var d in dict)
            {
                var product = this.context.Products
               .Where(p => p.Id == d.Value)
               .Include(p => p.Images)
               .Select(p => new ProductResource()
               {
                   Name = p.Name,
                   Description = p.Description,
                   Type = p.Type,
                   Quantity = p.Quantity,
                   Price = p.Price,
                   Images = p.Images.Select(i => new ImageResource()
                   {
                       Description = i.Description,
                       Type = i.Type,
                       Image = Convert.ToBase64String(i.Image)
                   }).ToList()
               })
               .FirstOrDefault();

                var name = d.Key;
                var jsonString = JsonSerializer.Serialize(product);
                System.IO.File.WriteAllText(@$".\Data\{name}.json", jsonString);
            }
       
           
            return Ok();

        }
    }
}