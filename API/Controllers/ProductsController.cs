﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.Models;
using API.Models.Filters;
using API.Models.Enums;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly EFContext context;
        private readonly UserManager<User> userManager;

        public ProductsController(EFContext context, UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            return await context.Products.Include(p => p.Owner)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] ProductFilters filters)
        {
            var user = await userManager.FindByEmailAsync(this.User.FindFirst(ClaimTypes.Email).Value);

            return await context.Products.Include(p => p.Owner)
                .Where(p => p.Status == ProductStatus.Listed)
                .Where(p => filters.IsOwner == null || p.Owner.Id == user.Id)
                .Where(p => filters.Search == null || p.Name.ToLower().Contains(filters.Search.ToLower()) || p.Description.ToLower().Contains(filters.Search.ToLower()))
                .Where(p => filters.ProductType == null || p.Type == filters.ProductType)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            try
            {
                var user = await userManager.FindByEmailAsync(this.User.FindFirst(ClaimTypes.Email).Value);

                if (ProductExists(product.Id))
                {
                    context.Entry(product).State = EntityState.Modified;
                }
                else
                {
                    product.Owner = user;
                    context.Products.Add(product);
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
                var product = await context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound();
                }

                product.Status = ProductStatus.Unlisted;
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
