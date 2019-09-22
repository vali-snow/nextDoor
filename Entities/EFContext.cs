using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities
{
    public class EFContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public EFContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = new Guid("bee381a3-fe38-4c79-8c4a-a0ac1ab4c508"),
                FirstName = "Admin",
                LastName = "Admin",
                Email = "admin@admin.com",
                Password = "1"
            },
            new User
            {
                Id = new Guid("71941ffc-a6f1-493b-9e01-5a06f75399bc"),
                FirstName = "Valentin",
                LastName = "Sarghi",
                Email = "valentin.sarghi@gmail.com",
                Password = "7"
            });
        }
    }
}
