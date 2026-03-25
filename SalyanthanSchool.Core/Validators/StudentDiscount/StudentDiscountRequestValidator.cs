using FluentValidation;
using SalyanthanSchool.Core.DTOs.StudentDiscount;

namespace SalyanthanSchool.Core.Validators.StudentDiscount
{
    public class StudentDiscountRequestValidator : AbstractValidator<StudentDiscountRequestDto>
    {
        public StudentDiscountRequestValidator()
        {
            RuleFor(x => x.StudentId)
                .NotEmpty().WithMessage("StudentId is required.")
                .GreaterThan(0).WithMessage("StudentId must be a valid ID.");

            RuleFor(x => x.FeeHeadId)
                .NotEmpty().WithMessage("FeeHeadId is required.")
                .GreaterThan(0).WithMessage("FeeHeadId must be a valid ID.");

            RuleFor(x => x.AcademicYearId).GreaterThan(0);

            RuleFor(x => x.DiscountValue)
                .GreaterThan(0)
                .Must((dto, val) => !dto.IsPercentage || val <= 100)
                .WithMessage("Percentage discount cannot exceed 100%.");

            RuleFor(x => x.ValidFrom)
                .NotEmpty().WithMessage("Start date is required.");

            RuleFor(x => x.ValidTo)
                .NotEmpty().WithMessage("End date is required.")
                .GreaterThan(x => x.ValidFrom).WithMessage("End date must be after start date.");
        }
    }
}
