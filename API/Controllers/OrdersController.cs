using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using Microsoft.AspNetCore.Authorization;
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

        public OrdersController(EFContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders([FromQuery] OrderFilters filters)
        {
            var user = context.Users
                    .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                    .FirstOrDefault();
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
                var buyer = context.Users
                    .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                    .Include(u => u.Activity)
                    .FirstOrDefault();
                var product = context.Products
                    .Where(p => p.Id == orderDTO.ProductId)
                    .Include(p => p.Owner)
                        .ThenInclude(o => o.Activity)
                    .Include(p => p.Images)
                    .FirstOrDefault();
                var seller = product.Owner;
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
                    var order = new Order()
                    {
                        Product = product,
                        Quantity = orderDTO.Quantity,
                        Status = OrderStatus.New,
                        Seller = product.Owner,
                        Buyer = buyer,
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
                    buyer.Activity.Add(new Activity()
                    {
                        Date = DateTime.Now,
                        Type = ActivityType.OrderPlace,
                        Message = $"Order placed: {product.Name}",
                        Reference = order.Id
                    });
                    seller.Activity.Add(new Activity()
                    {
                        Date = DateTime.Now,
                        Type = ActivityType.OrderPlace,
                        Message = $"Order placed for one of your products:  {product.Name}",
                        Reference = order.Id
                    });

                    await context.SaveChangesAsync();
                    return CreatedAtAction("GetOrder", new { id = order.Id }, order);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("Complete/{id}")]
        public async Task<ActionResult<Order>> CompleteOrder(Guid id)
        {
            var order = context.Orders
                .Where(o => o.Id == id)
                .Include(o => o.Product)
                .Include(o => o.Seller)
                    .ThenInclude(s => s.Activity)
                .Include(o => o.Buyer)
                    .ThenInclude(b => b.Activity)
                .FirstOrDefault();
            if (order == null)
            {
                return BadRequest();
            }
            else
            {
                var user = context.Users
                    .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                    .Include(u => u.Activity)
                    .FirstOrDefault();
                
                order.Status = OrderStatus.Completed;
                order.DateCompleted = DateTime.Now;
                order.CompletedBy = $"{user.FirstName} {user.LastName}";

                var seller = order.Seller;
                var buyer = order.Buyer;

                buyer.Activity.Add(new Activity()
                {
                    Date = DateTime.Now,
                    Type = ActivityType.OrderReveive,
                    Message = $"Order received: {order.Product.Name}",
                    Reference = order.Id
                });
                seller.Activity.Add(new Activity()
                {
                    Date = DateTime.Now,
                    Type = ActivityType.OrderFulfill,
                    Message = $"Order fulfilled: {order.Product.Name}",
                    Reference = order.Id
                });
                await context.SaveChangesAsync();
                return Ok();
            }
        }

        [HttpPost("Cancel/{id}")]
        public async Task<ActionResult<Order>> CancelOrder(Guid id, string reason)
        {
            var order = context.Orders
                .Where(o => o.Id == id)
                .Include( o => o.Product)
                .Include(o => o.Seller)
                    .ThenInclude(s => s.Activity)
                .Include(o => o.Buyer)
                    .ThenInclude(b => b.Activity)
                .FirstOrDefault();
            if (order == null)
            {
                return BadRequest();
            }
            if (order.Status != OrderStatus.New)
            {
                return BadRequest();
            }
            var user = context.Users
                .Where(u => u.Email == this.User.FindFirst(ClaimTypes.Email).Value)
                .FirstOrDefault();
            order.Status = OrderStatus.Cancelled;
            order.DateCancelled = DateTime.Now;
            order.CancelledBy = $"{user.FirstName} {user.LastName}";
            if (reason != null)
            {
                order.ReasonCancelled = reason;
            }

            var seller = order.Seller;
            var buyer = order.Buyer;

            buyer.Activity.Add(new Activity()
            {
                Date = DateTime.Now,
                Type = ActivityType.OrderCancel,
                Message = $"Order cancelled: {order.Product.Name}",
                Reference = order.Id
            });
            seller.Activity.Add(new Activity()
            {
                Date = DateTime.Now,
                Type = ActivityType.OrderCancel,
                Message = $"Order cancelled: {order.Product.Name}",
                Reference = order.Id
            });
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
