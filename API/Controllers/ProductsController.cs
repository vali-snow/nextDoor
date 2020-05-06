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
using API.Engines;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly EFContext context;
        private readonly ProductsEngine engine;

        public ProductsController(EFContext context, ProductsEngine engine)
        {
            this.context = context;
            this.engine = engine;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            return await engine.GetProduct(id);
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery] ProductFilters filters)
        {
            var user = context.Users
                .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                .FirstOrDefault();

            return await engine.GetProducts(user, filters);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct()
        {
            try
            {
                var user = context.Users
                    .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                    .Include(u => u.Activity)
                    .FirstOrDefault();
                var form = Request.Form;
                var product = JsonSerializer.Deserialize<Product>(form["product"]);
                var images = new List<ImageDetail>();
                foreach (var file in form.Files)
                {
                    using var memoryStream = new MemoryStream();
                    await file.CopyToAsync(memoryStream);
                    images.Add(new ImageDetail
                    {
                        ProductId = null,
                        Description = file.FileName,
                        Type = file.ContentType,
                        Image = memoryStream.ToArray()
                    });
                }

                var result = engine.PostProduct(user, product, images);
                return CreatedAtAction("GetProduct", new { id = result.Id }, result);                
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(Guid id)
        {
            try
            {
                var user = context.Users
                    .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                    .Include(u => u.Activity)
                    .FirstOrDefault();

                var result = engine.DeleteProduct(user, id);
                if (result)
                {
                    return NoContent();
                }
                else
                {
                    return NotFound();
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
    }
}
