using FluentValidation;
using SalyanthanSchool.Core.DTOs.AcademicYear;

namespace SalyanthanSchool.Core.Validators.AcademicYear
{
    public class AcademicYearRequestDtoValidator : AbstractValidator<AcademicYearRequestDto>
    {
        public AcademicYearRequestDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Academic Year name is required.")
                .MaximumLength(20).WithMessage("Name cannot exceed 20 characters.")
                .Matches(@"^\d{4}([/-]\d{2,4})?$")
                .WithMessage("Year should be like '2081', '2081/82', or '2020-2021'.");
            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start date is required.");

            RuleFor(x => x.EndDate)
                .NotEmpty().WithMessage("End date is required.")
                .GreaterThan(x => x.StartDate).WithMessage("End date must be after the start date.");
        }
    }
}