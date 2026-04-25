using FluentValidation;
using Microsoft.AspNetCore.Http;
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

            // PAN Number
            RuleFor(x => x.PanNumber)
                .NotEmpty().WithMessage("PAN Number is required.")
                .MaximumLength(50);

            // NID Number
            RuleFor(x => x.NidNumber)
                .MaximumLength(50);

            // Qualification
            RuleFor(x => x.Qualification)
                .NotEmpty().WithMessage("Qualification is required.")
                .MaximumLength(100);

            // Joining Date
            RuleFor(x => x.JoiningDate)
                .Must(jd => jd <= DateOnly.FromDateTime(DateTime.Today))
                .WithMessage("Joining Date cannot be in the future.");

            // Photo (File upload)
            RuleFor(x => x.Photo)
                .Must(BeValidImage)

                .When(x => x.Photo != null)
                .WithMessage("Photo must be JPG, JPEG, or PNG and less than 5MB.");


            // IsActive
            RuleFor(x => x.IsActive)
                .NotNull();
        }

        // --- Helper method for validating uploaded image ---
        private bool BeValidImage(IFormFile? file)
        {
            if (file == null) return true;

            var allowedTypes = new[]
            {
                "image/jpeg",
                "image/png",
                "image/jpg"
            };

            return allowedTypes.Contains(file.ContentType)
                   && file.Length > 0
                   && file.Length <= 5 * 1024 * 1024; // 5MB
        }
    }
}