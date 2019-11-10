using API.Data;
using API.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddIdentity<User, IdentityRole>(config => { config.User.RequireUniqueEmail = true; })
                    .AddEntityFrameworkStores<EFContext>();
            services.Configure<IdentityOptions>( options => {
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 4;
            });

            services.AddControllers();
            services.AddDbContext<EFContext>(options => options.UseSqlServer(Configuration["ConnectionString:nextDoor"]));
            services.AddTransient<Seeder>();

            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) { app.UseDeveloperExceptionPage(); }

            app.UseHttpsRedirection();

            app.UseCors( builder => builder.WithOrigins("https://localhost:44356")
               .AllowAnyHeader()
               .AllowAnyMethod()
            );
            
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
