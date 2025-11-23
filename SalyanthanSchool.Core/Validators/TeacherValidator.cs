using System;
using FluentValidation;
using SalyanthanSchool.Core.DTOs;

namespace SalyanthanSchool.Core.Validators
{
    public class TeacherValidator : AbstractValidator<TeacherDTO>
    {
        public TeacherValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First Name is required")
                .Length(3, 50).WithMessage("First Name must be 3-50 characters");

            RuleFor(x => x.MiddleName)
                .MaximumLength(50).WithMessage("Middle Name must be at most 50 characters")
                .When(x => !string.IsNullOrWhiteSpace(x.MiddleName));

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last Name is required")
                .Length(3, 50).WithMessage("Last Name must be 3-50 characters");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Address is required")
                .Length(3, 200).WithMessage("Address must be 3-200 characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid Email")
                .MaximumLength(100);

            RuleFor(x => x.PAN)
                .MaximumLength(20)
                .Matches(@"^[A-Za-z0-9\-]*$").When(x => !string.IsNullOrWhiteSpace(x.PAN))
                .WithMessage("PAN must be alphanumeric");

            RuleFor(x => x.NID)
                .MaximumLength(30)
                .Matches(@"^[A-Za-z0-9\-]*$").When(x => !string.IsNullOrWhiteSpace(x.NID))
                .WithMessage("NID must be alphanumeric");

            RuleFor(x => x.Mobile)
                .NotEmpty().WithMessage("Mobile is required")
                .Matches(@"^\d+$").WithMessage("Mobile must contain only digits")
                .Length(10, 15).WithMessage("Mobile must be 10-15 digits");

            RuleFor(x => x.DateOfBirth)
                .LessThanOrEqualTo(DateTime.Today).WithMessage("Date of Birth cannot be in the future");

            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender is required")
                .Must(g => g == "Male" || g == "Female")
                .WithMessage("Gender must be 'Male' or 'Female'");

            RuleFor(x => x.Citizenship)
                .NotEmpty().WithMessage("Citizenship is required")
                .MaximumLength(100);

            RuleFor(x => x.Qualification)
                .NotEmpty().WithMessage("Qualification is required")
                .MaximumLength(500);
        }
    }
}
