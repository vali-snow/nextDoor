using API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class EFContext : IdentityDbContext<User>
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<ImageDetail> ImageDetails { get; set; }
        public EFContext(DbContextOptions options) : base(options)
        {
        }      
    }
}
