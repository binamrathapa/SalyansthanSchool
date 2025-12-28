using FluentValidation;
using SalyanthanSchool.Core.DTOs.Teacher;

namespace SalyanthanSchool.Core.Validators.Teacher
{
    public class TeacherRequestDtoValidator : AbstractValidator<TeacherRequestDto>
    {
        // Regex patterns (simplified for example, use more robust ones in production)
        private const string AlphabetRegex = @"^[a-zA-Z\s]+$";
        private const string EmailRegex = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        private const string PhoneRegex = @"^\d{7,15}$"; // Simple digit check

        // Define the allowed genders
        private readonly string[] AllowedGenders = { "Male", "Female", "Other" };

        public TeacherRequestDtoValidator()
        {
            // EmployeeCode
            RuleFor(x => x.EmployeeCode)
                .NotEmpty().WithMessage("Employee Code is required.")
                .MaximumLength(50); // Assuming Varchar max length

            // First Name
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First Name is required.")
                .MaximumLength(50)
                .Matches(AlphabetRegex).WithMessage("First Name must contain only alphabetic characters.");

            // Middle Name
            RuleFor(x => x.MiddleName)
                .MaximumLength(50)
                .When(x => !string.IsNullOrWhiteSpace(x.MiddleName))
                .Matches(AlphabetRegex).WithMessage("Middle Name must contain only alphabetic characters.");

            // Last Name
            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last Name is required.")
                .MaximumLength(50)
                .Matches(AlphabetRegex).WithMessage("Last Name must contain only alphabetic characters.");

            // Gender
            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender is required.")
                .Must(g => AllowedGenders.Contains(g, StringComparer.OrdinalIgnoreCase))
                .WithMessage($"Gender must be one of: {string.Join(", ", AllowedGenders)}.");

            // Date of Birth (Age > 18, Past Date)
            RuleFor(x => x.DateOfBirth)
                .Must(dob => dob < DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Date of Birth must be in the past.")
                .Must(dob => dob <= DateOnly.FromDateTime(DateTime.Today.AddYears(-18)))
                .WithMessage("Teacher must be at least 18 years old.");

            // Email
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.") // Basic .NET email format check
                .Matches(EmailRegex).WithMessage("Invalid email format."); // Redundant but illustrates the use of custom regex

            // Mobile No
            RuleFor(x => x.MobileNo)
                .NotEmpty().WithMessage("Mobile Number is required.")
                .Matches(PhoneRegex).WithMessage("Invalid mobile number format.");

            // Address
            RuleFor(x => x.Address)
                .MaximumLength(255);

            // PAN Number (Assuming it's unique but validation format depends on the region)
            RuleFor(x => x.PanNumber)
                .NotEmpty().WithMessage("PAN Number is required.")
                .MaximumLength(50); // Placeholder length

            // Qualification
            RuleFor(x => x.Qualification)
                .NotEmpty().WithMessage("Qualification is required.")
                .MaximumLength(100);

            // Joining Date
            RuleFor(x => x.JoiningDate)
                .Must(jd => jd <= DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Joining Date cannot be in the future.");

            // Photo (URL/Path) - Simple URL check
            RuleFor(x => x.Photo)
                .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
                .When(x => !string.IsNullOrEmpty(x.Photo))
                .WithMessage("Photo must be a valid URL or path.");

            // IsActive
            RuleFor(x => x.IsActive)
                .NotNull();
        }
    }
}