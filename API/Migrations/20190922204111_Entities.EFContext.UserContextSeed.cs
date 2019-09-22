using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class EntitiesEFContextUserContextSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "Password" },
                values: new object[] { new Guid("bee381a3-fe38-4c79-8c4a-a0ac1ab4c508"), "admin@admin.com", "Admin", "Admin", "1" });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "Email", "FirstName", "LastName", "Password" },
                values: new object[] { new Guid("71941ffc-a6f1-493b-9e01-5a06f75399bc"), "valentin.sarghi@gmail.com", "Valentin", "Sarghi", "7" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("71941ffc-a6f1-493b-9e01-5a06f75399bc"));

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: new Guid("bee381a3-fe38-4c79-8c4a-a0ac1ab4c508"));
        }
    }
}
