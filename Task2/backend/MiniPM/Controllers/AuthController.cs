using Microsoft.AspNetCore.Mvc;
using MiniPM.Services;
using MiniPM.DTOs;
using System.Threading.Tasks;

namespace MiniPM.Controllers
{
    [ApiController]
    [Route("api/auth")]   // ✅ This is the important line
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var token = await _authService.RegisterAsync(dto.Username, dto.Password);
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto.Username, dto.Password);
            if (token == null)
                return Unauthorized("Invalid credentials");

            return Ok(new { token });
        }
    }
}
