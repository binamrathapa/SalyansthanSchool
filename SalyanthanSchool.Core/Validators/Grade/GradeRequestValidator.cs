using FluentValidation;
using SalyanthanSchool.Core.DTOs.Grade;

namespace SalyanthanSchool.Core.Validators.Grade
{
    public class GradeRequestDtoValidator : AbstractValidator<GradeRequestDto>
    {
        public GradeRequestDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Grade name is required")
                .MaximumLength(50);

            RuleFor(x => x.IsActive)
                .NotNull();

            RuleFor(x => x.SectionId)
                .NotNull().WithMessage("Section is required")
                .GreaterThan(0).WithMessage("Invalid Section ID");
        }
    }
}