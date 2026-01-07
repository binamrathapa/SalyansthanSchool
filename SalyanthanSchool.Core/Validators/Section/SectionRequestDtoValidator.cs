using FluentValidation;
using SalyanthanSchool.Core.DTOs.Section;

namespace SalyanthanSchool.Core.Validators.Section
{
    public class SectionRequestDtoValidator : AbstractValidator<SectionRequestDto>
    {
        public SectionRequestDtoValidator()
        {
            RuleFor(x => x.SectionName)
                .NotEmpty().WithMessage("Section name is required")
                .MaximumLength(100);
        }
    }
}