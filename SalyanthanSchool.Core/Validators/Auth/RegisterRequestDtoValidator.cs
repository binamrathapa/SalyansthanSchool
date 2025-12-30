using FluentValidation;
using SalyanthanSchool.Core.DTOs.Auth;

namespace SalyanthanSchool.Core.Validators.Auth
{
    public class RegisterRequestDtoValidator : AbstractValidator<RegisterRequestDto>
    {
        public RegisterRequestDtoValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required")
                .MinimumLength(4).WithMessage("Username must be at least 4 characters")
                .MaximumLength(20);

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter")
                .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter")
                .Matches(@"[0-9]").WithMessage("Password must contain at least one number")
                .Matches(@"[\!\?\*\.]|[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character (e.g. $, #, @)");

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MaximumLength(50);

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(50);

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("A valid email address is required")
                .When(x => !string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Role is required")
                .Must(role => new[] { "Admin", "Teacher", "Accountant" }.Contains(role))
                .WithMessage("Role must be either Admin, Teacher, or Accountant");
        }
    }
}