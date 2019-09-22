﻿// <auto-generated />
using System;
using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Migrations
{
    [DbContext(typeof(EFContext))]
    [Migration("20190922204111_Entities.EFContext.UserContextSeed")]
    partial class EntitiesEFContextUserContextSeed
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.11-servicing-32099")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Entities.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Email");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.Property<string>("Password");

                    b.HasKey("Id");

                    b.ToTable("User");

                    b.HasData(
                        new { Id = new Guid("bee381a3-fe38-4c79-8c4a-a0ac1ab4c508"), Email = "admin@admin.com", FirstName = "Admin", LastName = "Admin", Password = "1" },
                        new { Id = new Guid("71941ffc-a6f1-493b-9e01-5a06f75399bc"), Email = "valentin.sarghi@gmail.com", FirstName = "Valentin", LastName = "Sarghi", Password = "7" }
                    );
                });
#pragma warning restore 612, 618
        }
    }
}
