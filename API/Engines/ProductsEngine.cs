using API.Models;
using API.Models.Enums;
using API.Models.Filters;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace API.Engines
{
    public class ProductsEngine
    {
        private EFContext context;
        private readonly IDataProtector protector;
        public ProductsEngine(EFContext context, IDataProtectionProvider protectionProvider)
        {
            this.context = context;
            this.protector = protectionProvider.CreateProtector("luckyNumber7");
        }

        public Product GetProduct(Guid id)
        {
            var product = context.Products
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Include(p => p.Owner)
                    .ThenInclude(o => o.Activity)
                .Include(p => p.Images)
                .FirstOrDefault();
            if (product != null)
            { 
                
                product.Owner.FirstName = protector.Unprotect(product.Owner.FirstName);
                product.Owner.LastName = protector.Unprotect(product.Owner.LastName);
                product.Owner.PhoneNumber = protector.Unprotect(product.Owner.PhoneNumber);
            }
            return product;
        }

        public List<Product> GetProducts(User user, ProductFilters filters)
        {
            return context.Products
                .AsNoTracking()
                .Where(p => p.Status == ProductStatus.Listed)
                .Where(p => filters.Search == null || p.Name.ToLower().Contains(filters.Search.ToLower()) || p.Description.ToLower().Contains(filters.Search.ToLower()))
                .Where(p => filters.ProductType == null || p.Type == filters.ProductType)
                .Include(p => p.Owner)
                    .ThenInclude(o => o.Activity)
                .Where(p => filters.IsOwner == null || p.Owner.Id == user.Id)
                .Include(p => p.Images)
                .ToList();
        }

        public Product PostProduct(User user, Product product, List<ImageDetail> images, DateTime? date = null)
        {
            if (date.HasValue == false)
            {
                date = DateTime.Now;
            }
            if (ProductExists(product.Id))
            {
                context.Entry(product).State = EntityState.Modified;
                user.Activity.Add(new Activity()
                {
                    Date = date.Value,
                    Type = ActivityType.ProductEdit,
                    Message = $"Product edited:  {product.Name}",
                    Reference = product.Id
                });
            }
            else
            {
                product.Owner = user;
                product.DateCreated = date.Value;
                context.Products.Add(product);
                images.ForEach(i =>
                {
                    i.ProductId = product.Id;
                });
                product.Images = images;

                user.Activity.Add(new Activity() { Date = date.Value, Type = ActivityType.ProductCreate, Message = $"Product created:  {product.Name}", Reference = product.Id });
            }
            context.SaveChanges();
            return product;
        }

        private bool ProductExists(Guid id)
        {
            return context.Products.Any(p => p.Id == id);
        }

        public bool DeleteProduct(User user, Guid id, DateTime? date = null)
        {
            if (date.HasValue == false)
            {
                date = DateTime.Now;
            }

            var product = context.Products.Find(id);
            if (product == null)
            {
                return false;
            }

            product.Status = ProductStatus.Removed;
            user.Activity.Add(new Activity() { Date = date.Value, Type = ActivityType.ProductRemove, Message = $"Product removed:  {product.Name}", Reference = product.Id });

            context.SaveChanges();
            return true;
        }
    }
}
