namespace SalyanthanSchool.Core.DTOs.Auth
{
    public class AuthResponseDto
    {
        public int Id { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = null!;
        public string? Token { get; set; }
        public string? Username { get; set; }
        public string? Role { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}