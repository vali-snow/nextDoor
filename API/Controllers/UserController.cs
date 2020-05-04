using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Models;
using API.Models.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly EFContext context;
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly AppSettings appSettings;

        public UserController(EFContext context, UserManager<User> userManager, SignInManager<User> signInManager, IOptions<AppSettings> appSettings)
        {
            this.context = context;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.appSettings = appSettings.Value;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = context.Users
                .Where(u => u.Id == id)
                .Include(u => u.Activity).FirstOrDefault();

            return await context.Users
                .Where(u => u.Id == id)
                .Include(u => u.Activity)
                .Select(u => new User {
                    Id = u.Id,
                    FirstName= u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Activity = u.Activity
                })
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> RegisterUser(RegisterUserDTO sent)
        {
            var now = DateTime.Now;
            var user = new User()
            {
                UserName = sent.Email,
                FirstName = sent.FirstName,
                LastName = sent.LastName,
                Email = sent.Email,
                Activity = new List<Activity> {
                    new Activity() {
                        Date = now,
                        Type = ActivityType.AccountCreate,
                        Message = "Account created"
                    }
                },
                DateCreated = now
            };

            try
            {
                var result = await userManager.CreateAsync(user, sent.Password);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginDTO sent)
        {
            var user = await userManager.FindByEmailAsync(sent.Email);
            if (user != null && await userManager.CheckPasswordAsync(user, sent.Password))
            {
                var token = new JwtSecurityToken(
                    expires: DateTime.Now.AddHours(3),
                    claims: new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Email, user.Email),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    },
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256)
                );

                return Ok(new
                {
                    userId = user.Id,
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}