using System;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult GetOrder(Guid id)
        {
            try
            {
                var order = engine.GetOrder(id);
                if (order != null)
                {
                    return Ok(order);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpGet]
        public IActionResult GetOrders([FromQuery] OrderFilters filters)
        {
            try
            {
                var user = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);
                var orders = engine.GetOrders(user, filters);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }            
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
            try
            {
                var user = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);
                if (engine.CompleteOrder(user, id) != null)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            
        }

        [HttpPost("Cancel/{id}")]
        public IActionResult CancelOrder(Guid id, string reason)
        {
            try
            {
                var user = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);
                if (engine.CancelOrder(user, id, reason) != null)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
