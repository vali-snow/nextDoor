using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using API.Models.Filters;
using API.Models.Enums;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly EFContext context;
        private readonly UserManager<User> userManager;

        public OrdersController(EFContext context, UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders([FromQuery] OrderFilters filters)
        {
            var user = await userManager.FindByEmailAsync(this.User.FindFirst(ClaimTypes.Email).Value);

            return await context.Orders
                .Include(o => o.DeliverToUser)
                .Include(o => o.Product)
                .ThenInclude(p => p.Owner)
                .Where(o => filters.OrderType == null ||
                           (filters.OrderType == OrderType.ToReceive && o.DeliverToUser.Id == user.Id) ||
                           (filters.OrderType == OrderType.ToFulfill && o.Product.Owner.Id == user.Id))
                .Where(o => filters.Search == null || o.Product.Name.ToLower().Contains(filters.Search.ToLower()) || o.Product.Description.ToLower().Contains(filters.Search.ToLower()))
                .Where(o => filters.OrderStatus == null || o.Status == filters.OrderStatus)
                .Where(o => filters.ProductType == null || o.Product.Type == filters.ProductType)
                .Where(o => filters.DateRange == null || (filters.DateRange.Begin < o.StartDate && o.StartDate < filters.DateRange.End))
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(Guid id)
        {
            var order = await context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return order;
        }
    }
}
