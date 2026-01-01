using FluentValidation;
using SalyanthanSchool.Core.DTOs.FeeCategory;
using SalyanthanSchool.Core.DTOs.FeeCategory.SalyanthanSchool.Core.DTOs.Account.FeeCategory;

namespace SalyanthanSchool.Core.Validators.FeeCategory
{
    public class FeeCategoryRequestValidator : AbstractValidator<FeeCategoryRequestDto>
    {
        public FeeCategoryRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");
        }
    }
}