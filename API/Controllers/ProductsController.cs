using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.Models.Filters;

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
                .Where(p => filters.IsOwner == null || p.Owner.Id == user.Id)
                .Where(p => filters.Search == null || p.Name.ToLower().Contains(filters.Search.ToLower()) || p.Description.ToLower().Contains(filters.Search.ToLower()))
                .Where(p => filters.ProductType == null || p.Type == filters.ProductType)
                .ToListAsync();
        }
    }
}
