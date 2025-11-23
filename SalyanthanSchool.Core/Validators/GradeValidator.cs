using FluentValidation;
using SalyanthanSchool.Core.DTOs;

namespace SalyanthanSchool.Core.Validators
{
    public class GradeValidator : AbstractValidator<GradeDto>
    {
        public GradeValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Grade name is required")
                .Length(3, 50).WithMessage("Grade name must be between 3 and 50 characters");
        }
    }
}
