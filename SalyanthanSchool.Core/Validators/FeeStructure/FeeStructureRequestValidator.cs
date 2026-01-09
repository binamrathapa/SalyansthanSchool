using FluentValidation;
using SalyanthanSchool.Core.DTOs.FeeStructure;

namespace SalyanthanSchool.Core.Validators.FeeStructure
{
    public class FeeStructureRequestValidator : AbstractValidator<FeeStructureRequestDto>
    {
        public FeeStructureRequestValidator()
        {
            RuleFor(x => x.Amount)
                .GreaterThan(0)
                .WithMessage("Amount must be greater than zero.");

            RuleFor(x => x.AcademicYearId)
                .NotNull().WithMessage("Academic Year is required.")
                .GreaterThan(0).WithMessage("Academic Year must be a valid ID.");

            RuleFor(x => x.GradeId)
                .NotNull().WithMessage("Grade is required.")
                .GreaterThan(0).WithMessage("Grade must be a valid ID.");

            RuleFor(x => x.FeeHeadId)
                .NotNull().WithMessage("Fee Head is required.")
                .GreaterThan(0).WithMessage("Fee Head must be a valid ID.");
        }
    }
}
