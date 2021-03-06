﻿using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using API.Models;
using API.Models.Filters;
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
        private readonly ProductsEngine engine;
        private readonly UsersEngine uEngine;

        public ProductsController(ProductsEngine engine, UsersEngine uEngine)
        {
            this.engine = engine;
            this.uEngine = uEngine;
        }

        [HttpGet("{id}")]
        public IActionResult GetProduct(Guid id)
        {
            try
            {
                var product = engine.GetProduct(id);
                if (product != null)
                {
                    return Ok(product);
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
        public IActionResult GetProducts([FromQuery] ProductFilters filters)
        {
            try
            {
                var user = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);
                var products = engine.GetProducts(user, filters);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public IActionResult PostProduct()
        {
            try
            {
                var user = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);
                var form = Request.Form;
                var product = JsonSerializer.Deserialize<Product>(form["product"]);
                var images = new List<ImageDetail>();
                foreach (var file in form.Files)
                {
                    using var memoryStream = new MemoryStream();
                    file.CopyTo(memoryStream);
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
                var user = uEngine.GetUser(this.User.FindFirst(ClaimTypes.Email).Value);

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
