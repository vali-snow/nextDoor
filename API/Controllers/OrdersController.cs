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

        [HttpGet("ToFulfill")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersToFulfill([FromQuery] OrderFilters filters)
        {
            var user = await userManager.FindByEmailAsync(this.User.FindFirst(ClaimTypes.Email).Value);

            var orders = context.Orders.Include(o => o.DeliverToUser).Include(o => o.Product).ThenInclude(p => p.Owner);

            var ordersToFulfill = orders.Where(o => o.Product.Owner.Email == user.Email)
                .Where(o => filters.OrderStatus == null || o.Status == filters.OrderStatus)
                .Where(o => filters.ProductType == null || o.Product.Type == filters.ProductType)
                .Where(o => filters.StartDate == null || filters.EndDate == null || (filters.StartDate < o.StartDate && o.StartDate < filters.EndDate));
            return await ordersToFulfill.ToListAsync();
        }

        [HttpGet("ToReceive")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersToReceive([FromQuery] OrderFilters filters)
        {
            var user = await userManager.FindByEmailAsync(this.User.FindFirst(ClaimTypes.Email).Value);

            var orders = context.Orders.Include(o => o.DeliverToUser).Include(o => o.Product).ThenInclude(p => p.Owner);

            var ordersToReceive = orders.Where(o => o.DeliverToUser.Id == user.Id)
                .Where(o => filters.OrderStatus == null || o.Status == filters.OrderStatus)
                .Where(o => filters.ProductType == null || o.Product.Type == filters.ProductType)
                .Where(o => filters.StartDate == null || filters.EndDate == null || (filters.StartDate < o.StartDate && o.StartDate < filters.EndDate));
            return await ordersToReceive.ToListAsync();
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
