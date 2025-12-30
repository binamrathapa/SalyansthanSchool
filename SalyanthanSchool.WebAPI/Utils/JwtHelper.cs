using Microsoft.IdentityModel.Tokens;
using SalyanthanSchool.Core.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SalyanthanSchool.WebAPI.Utils
{
    public static class JwtHelper
    {
        public static string GenerateToken(SystemUser user, IConfiguration config)
        {
            var jwt = config.GetSection("JwtSettings");

            var key = jwt["Key"]
                ?? throw new Exception("JWT Key missing");

            var issuer = jwt["Issuer"]
                ?? throw new Exception("JWT Issuer missing");

            var audience = jwt["Audience"]
                ?? throw new Exception("JWT Audience missing");

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role ?? "User")
    };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}