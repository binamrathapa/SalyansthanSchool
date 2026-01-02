using FluentValidation;
using SalyanthanSchool.Core.DTOs.FeeHead;

namespace SalyanthanSchool.Core.Validators.FeeHead
{
    public class FeeHeadRequestValidator : AbstractValidator<FeeHeadRequestDto>
    {
        public FeeHeadRequestValidator()
        {
            RuleFor(x => x.FeeCategoryId)
                .GreaterThan(0).WithMessage("A valid Fee Category must be selected.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Fee Head name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
        }
    }
}