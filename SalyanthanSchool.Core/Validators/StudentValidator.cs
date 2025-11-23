using FluentValidation;
using SalyanthanSchool.Core.DTOs;
using System;

namespace SalyanthanSchool.Core.Validators
{
    public class StudentValidator : AbstractValidator<StudentDto>
    {
        public StudentValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First Name is required")
                .Length(3, 50);

            RuleFor(x => x.MiddleName)
                .MaximumLength(50)
                .When(x => !string.IsNullOrWhiteSpace(x.MiddleName));

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last Name is required")
                .Length(3, 50);

            RuleFor(x => x.ParentName)
                .NotEmpty().WithMessage("Parent Name is required")
                .Length(3, 50);

            RuleFor(x => x.GuardianName)
                .NotEmpty().WithMessage("Guardian Name is required")
                .Length(3, 50);

            RuleFor(x => x.Mobile)
                .NotEmpty().WithMessage("Mobile number is required")
                .Matches(@"^\d+$").WithMessage("Mobile must contain only digits")
                .Length(10, 15);

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Address is required")
                .Length(3, 200);

            RuleFor(x => x.DateOfBirth)
                .LessThanOrEqualTo(DateTime.Today).WithMessage("Date of Birth cannot be a future date");

            RuleFor(x => x.AdmissionDate)
                .LessThanOrEqualTo(DateTime.Today).WithMessage("Admission Date cannot be a future date");

            RuleFor(x => x.BloodGroup)
                .NotEmpty().WithMessage("Blood Group is required")
                .Matches("^(A|B|AB|O)[+-]$").WithMessage("Invalid Blood Group");

            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender is required")
                .Must(g => g == "Male" || g == "Female").WithMessage("Gender must be Male or Female");
        }
    }
}
