using FluentValidation;
using SalyanthanSchool.Core.DTOs.Section;

namespace SalyanthanSchool.Core.Validators.Section
{
    public class SectionRequestDtoValidator : AbstractValidator<SectionRequestDto>
    {
        public SectionRequestDtoValidator()
        {
            RuleFor(x => x.GradeId)
                .GreaterThan(0).WithMessage("Grade ID must be a valid positive number.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Section name is required.")
                .MaximumLength(50);

            RuleFor(x => x.IsActive)
                .NotNull();
        }
    }
}