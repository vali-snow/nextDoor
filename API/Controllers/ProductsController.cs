using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.Models;
using API.Models.Filters;
using API.Models.Enums;
using System.Text.Json;
using System.IO;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly EFContext context;

        public ProductsController(EFContext context)
        {
            this.context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            return await context.Products
                .Where(p => p.Id == id)
                .Include(p => p.Owner)
                .Include(p => p.Images)
                .FirstOrDefaultAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] ProductFilters filters)
        {
            var user = context.Users
                .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                .FirstOrDefault();

            return await context.Products
                .Where(p => p.Status == ProductStatus.Listed)
                .Where(p => filters.Search == null || p.Name.ToLower().Contains(filters.Search.ToLower()) || p.Description.ToLower().Contains(filters.Search.ToLower()))
                .Where(p => filters.ProductType == null || p.Type == filters.ProductType)
                .Include(p => p.Owner)
                .Where(p => filters.IsOwner == null || p.Owner.Id == user.Id)
                .Include(p => p.Images)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct()
        {
            try
            {
                var form = Request.Form;
                var user = context.Users
                    .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                    .Include(u => u.Activity)
                    .FirstOrDefault();
                var product = JsonSerializer.Deserialize<Product>(form["product"]);

                if (ProductExists(product.Id))
                {
                    context.Entry(product).State = EntityState.Modified;
                    user.Activity.Add(new Activity()
                    {
                        Date = DateTime.Now,
                        Type = ActivityType.ProductEdit,
                        Message = $"Product edited:  {product.Name}",
                        Reference = product.Id
                    });
                }
                else
                {
                    product.Owner = user;
                    context.Products.Add(product);
                    foreach (var file in form.Files)
                    {
                        using var memoryStream = new MemoryStream();
                        await file.CopyToAsync(memoryStream);
                        context.ImageDetails.Add(new ImageDetail
                        {
                            ProductId = product.Id,
                            Description = file.FileName,
                            Type = file.ContentType,
                            Image = memoryStream.ToArray()
                        });
                    }
                    user.Activity.Add(new Activity()
                    {
                        Date = DateTime.Now,
                        Type = ActivityType.ProductCreate,
                        Message = $"Product created:  {product.Name}",
                        Reference = product.Id
                    });
                }
                await context.SaveChangesAsync();
                return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            try
            {
                var user = context.Users
                    .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                    .Include(u => u.Activity)
                    .FirstOrDefault();
                var product = await context.Products.FindAsync(id);

                if (product == null)
                {
                    return NotFound();
                }

                product.Status = ProductStatus.Unlisted;
                user.Activity.Add(new Activity()
                {
                    Date = DateTime.Now,
                    Type = ActivityType.ProductRemove,
                    Message = $"Product removed:  {product.Name}",
                    Reference = product.Id
                });

                await context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
            
        }

        private bool ProductExists(Guid id)
        {
            return context.Products.Any(p => p.Id == id);
        }
    }
}
