using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Engines;
using API.Models;
using API.Models.DTOs;
using API.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardEngine engine;

        public DashboardController(DashboardEngine engine)
        {
            this.engine = engine;
        }

        [HttpGet]
        public IActionResult GetDashboardInfo()
        {
            try
            {
                var dashDTO = engine.GetDashboardInfo();
                return Ok(dashDTO);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}