using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        private readonly EFContext context;

        public DashboardController(EFContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public ActionResult<DashDTO> GetDashboardInfo()
        {
            var dashDTO = new DashDTO
            {
                Summary = new DashSummaryDTO
                {
                    Users = new DashSummaryNewTotalDTO()
                    {
                        New = context.Users.Where(u => DateTime.Today.AddDays(-9) <= u.DateCreated.Date && u.DateCreated.Date <= DateTime.Today).Count(),
                        Total = context.Users.Count()
                    },
                    Products = new DashSummaryNewTotalDTO()
                    {
                        New = context.Products.Where(p => DateTime.Today.AddDays(-9) <= p.DateCreated.Date && p.DateCreated.Date <= DateTime.Today).Count(),
                        Total = context.Products.Count()
                    },
                    Orders = new DashSummaryNewTotalDTO()
                    {
                        New = context.Orders.Where(o => DateTime.Today.AddDays(-9) <= o.DatePlaced.Date && o.DatePlaced.Date <= DateTime.Today).Count(),
                        Total = context.Orders.Count()
                    }
                },
                Charts = new DashChartsDTO
                {
                    Products = new DashChartProductsDTO()
                    {
                        Goods = context.Products.Where(p => p.Type == ProductType.Good).Count(),
                        Services = context.Products.Where(p => p.Type == ProductType.Service).Count()
                    },
                    Orders = new DashChartOrdersDTO()
                    {
                        New = context.Orders.Where(o => o.Status == OrderStatus.New).Count(),
                        Completed = context.Orders.Where(o => o.Status == OrderStatus.Completed).Count(),
                        Cancelled = context.Orders.Where(o => o.Status == OrderStatus.Cancelled).Count()
                    },
                    Activity = GetActivityOfLast10Days()
                }
            };
            return dashDTO;
        }

        private DashChartActivityDTO GetActivityOfLast10Days()
        {
            var activityDTO = new DashChartActivityDTO()
            {
                NewUsers = new List<int>(),
                NewProducts = new List<int>(),
                NewOrders = new List<int>(),
                CompletedOrders = new List<int>(),
                CancelledOrders = new List<int>()
            };
            for (int i = 0; i < 10; i++)
            {
                var day = DateTime.Today.AddDays(-9 + i);
                activityDTO.NewUsers.Add(context.Users.Where(u => u.DateCreated.Date == day.Date).Count());
                activityDTO.NewProducts.Add(context.Products.Where(p => p.DateCreated.Date == day.Date).Count());
                activityDTO.NewOrders.Add(context.Orders.Where(o => o.DatePlaced.Date == day.Date).Count());
                activityDTO.CompletedOrders.Add(context.Orders.Where(o => o.DateCompleted.HasValue && o.DateCompleted.Value.Date == day.Date).Count());
                activityDTO.CancelledOrders.Add(context.Orders.Where(o => o.DateCancelled.HasValue && o.DateCancelled.Value.Date == day.Date).Count());
            }
            return activityDTO;
        }
    }
}