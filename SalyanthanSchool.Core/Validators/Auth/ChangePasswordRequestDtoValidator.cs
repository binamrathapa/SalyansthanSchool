using FluentValidation;
using SalyanthanSchool.Core.DTOs.Auth;

namespace SalyanthanSchool.Core.Validators.Auth
{
    public class ChangePasswordRequestDtoValidator : AbstractValidator<ChangePasswordRequestDto>
    {
        public ChangePasswordRequestDtoValidator()
        {
            RuleFor(x => x.CurrentPassword).NotEmpty();

            RuleFor(x => x.NewPassword)
                .NotEmpty()
                .MinimumLength(6)
                .Matches(@"[A-Z]").WithMessage("Password must contain uppercase letter")
                .Matches(@"[0-9]").WithMessage("Password must contain a number")
                .NotEqual(x => x.CurrentPassword).WithMessage("New password cannot be the same as old password");

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.NewPassword).WithMessage("Passwords do not match");
        }
    }
}