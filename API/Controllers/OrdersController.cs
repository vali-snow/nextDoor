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
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly EFContext context;
        private readonly UserManager<User> userManager;

        public OrdersController(EFContext context, UserManager<User> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersToFulfill([FromQuery] OrderFilters filters)
        {
            var currentUser = this.User;
            var currentUserEmail = currentUser.FindFirst(ClaimTypes.Email).Value;
            var user = await userManager.FindByEmailAsync(currentUserEmail);

            var orders = context.Orders.Include(o => o.DeliverToUser).Include(o => o.Product).ThenInclude(p => p.Owner);
            var ordersToFulfill = orders.Where(o => o.Product.Owner.Id == user.Id)
                .Where(o => filters.OrderStatus == null || o.Status == filters.OrderStatus)
                .Where(o => filters.ProductType == null || o.Product.Type == filters.ProductType)
                .Where(o => (filters.StartDate == null && filters.EndDate != null) || (filters.StartDate < o.StartDate && o.StartDate < filters.EndDate));
            return ordersToFulfill.ToList();
        }

        // GET: api/Orders/5
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

        // PUT: api/Orders/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(Guid id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            context.Entry(order).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Orders
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            context.Orders.Add(order);
            await context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Order>> DeleteOrder(Guid id)
        {
            var order = await context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            context.Orders.Remove(order);
            await context.SaveChangesAsync();

            return order;
        }

        private bool OrderExists(Guid id)
        {
            return context.Orders.Any(e => e.Id == id);
        }
    }
}
