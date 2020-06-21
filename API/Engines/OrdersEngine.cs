using API.Models;
using API.Models.DTOs;
using API.Models.Enums;
using API.Models.Filters;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace API.Engines
{
    public class OrdersEngine
    {
        private EFContext context;
        private readonly IDataProtector protector;

        public OrdersEngine(EFContext context, IDataProtectionProvider protectionProvider)
        {
            this.context = context;
            this.protector = protectionProvider.CreateProtector("luckyNumber7");
        }

        public Order GetOrder(Guid id)
        {
            var order = context.Orders
                .AsNoTracking()
                .Where(o => o.Id == id)
                .Include(o => o.Buyer)
                .Include(o => o.Seller)
                .Include(o => o.Product)
                    .ThenInclude(p => p.Images)
                .Include(o => o.AdditionalDetail)
                .FirstOrDefault();
            if (order != null)
            {
                order.Buyer.FirstName = protector.Unprotect(order.Buyer.FirstName);
                order.Buyer.LastName = protector.Unprotect(order.Buyer.LastName);
                order.Buyer.PhoneNumber = protector.Unprotect(order.Buyer.PhoneNumber);
                order.Seller.FirstName = protector.Unprotect(order.Seller.FirstName);
                order.Seller.LastName = protector.Unprotect(order.Seller.LastName);
                order.Seller.PhoneNumber = protector.Unprotect(order.Seller.PhoneNumber);
                order.AdditionalDetail.ContactName = protector.Unprotect(order.AdditionalDetail.ContactName);
                order.AdditionalDetail.ContactAddress = protector.Unprotect(order.AdditionalDetail.ContactAddress);
                order.AdditionalDetail.ContactPhone = protector.Unprotect(order.AdditionalDetail.ContactPhone);
                order.CompletedBy = order.CompletedBy != null ? protector.Unprotect(order.CompletedBy) : null;
                order.CancelledBy = order.CancelledBy != null ? protector.Unprotect(order.CancelledBy) : null;
            }
            return order;
        }

        public Order AddOrder(Order order)
        {
            context.Orders.Add(order);
            context.SaveChanges();
            return order;
        }

        public List<Order> GetOrders(User user, OrderFilters filters)
        {
            var orders = context.Orders
                .AsNoTracking()
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
                .ToList();
            orders.ForEach(o =>
                {
                    o.Buyer.FirstName = protector.Unprotect(o.Buyer.FirstName);
                    o.Buyer.LastName = protector.Unprotect(o.Buyer.LastName);
                    o.Buyer.PhoneNumber = protector.Unprotect(o.Buyer.PhoneNumber);
                    o.Seller.FirstName = protector.Unprotect(o.Seller.FirstName);
                    o.Seller.LastName = protector.Unprotect(o.Seller.LastName);
                    o.Seller.PhoneNumber = protector.Unprotect(o.Seller.PhoneNumber);
                    o.AdditionalDetail.ContactName = protector.Unprotect(o.AdditionalDetail.ContactName);
                    o.AdditionalDetail.ContactAddress = protector.Unprotect(o.AdditionalDetail.ContactAddress);
                    o.AdditionalDetail.ContactPhone = protector.Unprotect(o.AdditionalDetail.ContactPhone);
                });
            return orders;
        }

        public Order PlaceOrder(User buyer, OrderDTO orderDTO, DateTime? date = null)
        {
            if (date.HasValue == false)
            {
                date = DateTime.Now;
            }

            var product = context.Products
                .Where(p => p.Id == orderDTO.ProductId)
                .Include(p => p.Owner)
                .FirstOrDefault();

            if (product.Quantity == 0 || orderDTO.Quantity > product.Quantity)
            {
                return null;
            }
            if (product.Type == ProductType.Good)
            {
                product.Quantity -= orderDTO.Quantity;
                if (product.Quantity == 0)
                {
                    product.Status = ProductStatus.OutOfStock;
                }
            }

            var order = new Order()
            {
                Product = product,
                Quantity = orderDTO.Quantity,
                Total = orderDTO.Quantity * product.Price,
                Status = OrderStatus.New,
                Seller = product.Owner,
                Buyer = buyer,
                AdditionalDetail = new OrderDetail()
                {
                    ProductImage = product.Images.FirstOrDefault(),
                    ContactName = protector.Protect(orderDTO.ContactName),
                    ContactPhone = protector.Protect(orderDTO.ContactPhone),
                    ContactAddress = protector.Protect(orderDTO.ContactAddress)
                },
                DatePlaced = date.Value
            };
            context.Orders.Add(order);

            buyer.Activity.Add(new Activity() { Date = date.Value, Type = ActivityType.OrderPlace, Message = $"Order placed: {product.Name}", Reference = order.Id });
            product.Owner.Activity.Add(new Activity() { Date = date.Value, Type = ActivityType.OrderPlace, Message = $"Order placed for one of your products:  {product.Name}", Reference = order.Id });
            
            context.SaveChanges();
            return order;
        }

        public Order CancelOrder(User user, Guid id, string reason, DateTime? date = null)
        {
            if (date.HasValue == false)
            {
                date = DateTime.Now;
            }

            var order = context.Orders
                .Where(o => o.Id == id)
                .Include(o => o.Product)
                .Include(o => o.Seller)
                    .ThenInclude(s => s.Activity)
                .Include(o => o.Buyer)
                    .ThenInclude(b => b.Activity)
                .FirstOrDefault();

            if (order == null || order.Status != OrderStatus.New)
            {
                return null;
            }
            order.Status = OrderStatus.Cancelled;
            order.DateCancelled = date;
            order.CancelledBy = protector.Protect($"{protector.Unprotect(user.FirstName)} {protector.Unprotect(user.LastName)}");
            if (reason != null)
            {
                order.ReasonCancelled = reason;
            }
            if (order.Product.Type == ProductType.Good) {
                switch (order.Product.Status)
                {
                    case ProductStatus.Listed:
                        order.Product.Quantity += order.Quantity;
                        break;
                    case ProductStatus.OutOfStock:
                        order.Product.Quantity += order.Quantity;
                        order.Product.Status = ProductStatus.Listed;
                        break;
                    case ProductStatus.Removed:
                        break;
                }
            }

            order.Seller.Activity.Add(new Activity() { Date = date.Value, Type = ActivityType.OrderCancel, Message = $"Order cancelled: {order.Product.Name}", Reference = order.Id });
            order.Buyer.Activity.Add(new Activity() { Date = date.Value, Type = ActivityType.OrderCancel, Message = $"Order cancelled:  {order.Product.Name}", Reference = order.Id });            
            
            context.SaveChanges();
            return order;
        }

        public Order CompleteOrder(User user, Guid id, DateTime? date = null)
        {
            if (date.HasValue == false)
            {
                date = DateTime.Now;
            }

            var order = context.Orders
                .Where(o => o.Id == id)
                .Include(o => o.Product)
                .Include(o => o.Seller)
                    .ThenInclude(s => s.Activity)
                .Include(o => o.Buyer)
                    .ThenInclude(b => b.Activity)
                .FirstOrDefault();

            if (order != null)
            {
                order.Status = OrderStatus.Completed;
                order.DateCompleted = date.Value;
                order.CompletedBy = protector.Protect($"{protector.Unprotect(user.FirstName)} {protector.Unprotect(user.LastName)}");

                order.Seller.Activity.Add(new Activity() { Date = date.Value, Type = ActivityType.OrderReveive, Message = $"Order received: {order.Product.Name}", Reference = order.Id });
                order.Buyer.Activity.Add(new Activity() { Date = date.Value, Type = ActivityType.OrderFulfill, Message = $"Order fulfilled: {order.Product.Name}", Reference = order.Id });

                context.SaveChanges();
            }
            return order;
        }
    }
}
