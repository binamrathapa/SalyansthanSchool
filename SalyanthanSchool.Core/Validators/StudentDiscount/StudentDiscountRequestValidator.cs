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

            RuleFor(x => x.DiscountValue)
                .GreaterThan(0).WithMessage("Discount must be greater than 0");

            RuleFor(x => x.DiscountValue)
                .LessThanOrEqualTo(100).WithMessage("Discount cannot exceed 100.");
        }
    }
}
