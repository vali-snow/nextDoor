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
using Microsoft.AspNetCore.Http;
using API.Models.DTOs;

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
                .Where(o => filters.OrderStatus == null || o.Status == filters.OrderStatus)
                .Where(o => filters.DateRange == null || (filters.DateRange.Begin < o.DatePlaced && o.DatePlaced < filters.DateRange.End))
                .Include(o => o.Buyer)
                .Include(o => o.Seller)
                .Where(o => filters.OrderType == null ||
                           (filters.OrderType == OrderType.ToReceive && o.Buyer.Id == user.Id) ||
                           (filters.OrderType == OrderType.ToFulfill && o.Seller.Id == user.Id))
                .Include(o => o.Product)
                .Where(o => filters.ProductType == null || o.Product.Type == filters.ProductType)
                .Where(o => filters.Search == null || o.Product.Name.ToLower().Contains(filters.Search.ToLower()) || o.Product.Description.ToLower().Contains(filters.Search.ToLower()))
                .Include(o => o.AdditionalDetail)
                    .ThenInclude(a => a.ProductImage)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(Guid id)
        {
            return await context.Orders
                .Where(o => o.Id == id)
                .Include(o => o.Buyer)
                .Include(o => o.Seller)
                .Include(o => o.Product)
                    .ThenInclude(p => p.Images)
                .Include(o => o.AdditionalDetail)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(OrderDTO orderDTO)
        {
            try
            {
                var user = await userManager.FindByEmailAsync(this.User.FindFirst(ClaimTypes.Email).Value);
                var product = context.Products
                    .Where(p => p.Id == orderDTO.ProductId)
                    .Include(p => p.Owner)
                    .Include(p => p.Images)
                    .FirstOrDefault();

                if (product.Quantity == 0)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, product);
                }
                else if (orderDTO.Quantity > product.Quantity)
                {
                    return Conflict(product);
                }
                else
                {
                    product.Quantity -= orderDTO.Quantity;
                    var order = new Order() {
                        Product = product,
                        Quantity = orderDTO.Quantity,
                        Status = OrderStatus.New,
                        Seller = product.Owner,
                        Buyer = user,
                        AdditionalDetail = new OrderDetail()
                        {
                            ProductImage = product.Images.FirstOrDefault(),
                            ContactName = orderDTO.ContactName,
                            ContactPhone = orderDTO.ContactPhone,
                            ContactAddress = orderDTO.ContactAddress
                        },
                        DatePlaced = DateTime.Now        
                    };
                    context.Orders.Add(order);
                    await context.SaveChangesAsync();
                    return CreatedAtAction("GetOrder", new { id = order.Id }, order);
                }                
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}
