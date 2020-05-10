using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Engines;
using API.Models;
using API.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UsersEngine engine;
        private readonly UserManager<User> userManager;
        private readonly AppSettings appSettings;

        public UserController(UsersEngine engine, UserManager<User> userManager, IOptions<AppSettings> appSettings)
        {
            this.engine = engine;
            this.userManager = userManager;
            this.appSettings = appSettings.Value;
        }

        [HttpGet("{id}")]
        public UserDTO GetUser(Guid id)
        {

            return engine.GetUser(id);
                
        }

        [HttpPost]
        [Route("register")]
        public IActionResult RegisterUser(RegisterUserDTO sent)
        {
            try
            {
                var result = engine.RegisterUser(sent);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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