using FluentValidation;
using SalyanthanSchool.Core.DTOs.Subject;

namespace SalyanthanSchool.Core.Validators.Subject
{
    public class SubjectRequestDtoValidator : AbstractValidator<SubjectRequestDto>
    {
        public SubjectRequestDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Subject name is required.")
                .MaximumLength(100);

            RuleFor(x => x.IsActive)
                .NotNull();
        }
    }
}