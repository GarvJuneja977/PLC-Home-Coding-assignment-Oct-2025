using MiniPM.DTOs;
using MiniPM.Models;

namespace MiniPM.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(string username, string password);
        Task<string?> LoginAsync(string username, string password);
    }
}
