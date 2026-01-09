using FluentValidation;
using SalyanthanSchool.Core.DTOs.AcademicYear;

namespace SalyanthanSchool.Core.Validators.AcademicYear
{
    public class AcademicYearPatchDtoValidator : AbstractValidator<AcademicYearPatchDto>
    {
        public AcademicYearPatchDtoValidator()
        {
            // Only validate if the property is actually provided (not null)
            RuleFor(x => x.Name)
                .MaximumLength(20)
                .Matches(@"^\d{4}(/\d{2,4})?$")
                .When(x => x.Name != null);

            // Cross-property validation for dates during a patch
            RuleFor(x => x)
                .Must(x => x.EndDate > x.StartDate)
                .WithMessage("End date must be after the start date.")
                .When(x => x.StartDate.HasValue && x.EndDate.HasValue);
        }
    }
}