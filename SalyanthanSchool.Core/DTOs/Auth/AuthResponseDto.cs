namespace SalyanthanSchool.Core.DTOs.Auth
{
    public class AuthResponseDto
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = null!;
        public string? Token { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}
