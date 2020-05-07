using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.Models.Filters;
using Microsoft.AspNetCore.Http;
using API.Models.DTOs;
using API.Engines;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly OrdersEngine engine;
        private readonly UsersEngine uEngine;
        private readonly ProductsEngine pEngine;

        public OrdersController(EFContext context, OrdersEngine engine, UsersEngine uEngine, ProductsEngine pEngine)
        {
            this.engine = engine;
            this.uEngine = uEngine;
            this.pEngine = pEngine;
        }

        [HttpGet("{id}")]
        public Order GetOrder(Guid id)
        {
            return engine.GetOrder(id);
        }

        [HttpGet]
        public List<Order> GetOrders([FromQuery] OrderFilters filters)
        {
            var user = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);
            return engine.GetOrders(user, filters);
        }



        [HttpPost]
        public IActionResult PostOrder(OrderDTO orderDTO)
        {
            try
            {
                var buyer = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);
                var product = pEngine.GetProduct(orderDTO.ProductId);

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
                    var order = engine.PlaceOrder(buyer, orderDTO);
                    return CreatedAtAction("GetOrder", new { id = order.Id }, order);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("Complete/{id}")]
        public IActionResult CompleteOrder(Guid id)
        {
            var user = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);
            if (engine.CompleteOrder(user, id) == null) {
                return BadRequest();
            }
            return Ok();
        }

        [HttpPost("Cancel/{id}")]
        public async Task<ActionResult<Order>> CancelOrder(Guid id, string reason)
        {
            var user = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);
            if (engine.CancelOrder(user, id, reason) == null)
            {
                return BadRequest();
            }
            return Ok();
        }
    }
}
