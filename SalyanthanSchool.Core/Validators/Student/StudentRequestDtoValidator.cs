using FluentValidation;
using Microsoft.AspNetCore.Http;
using SalyanthanSchool.Core.DTOs.Student;

namespace SalyanthanSchool.Core.Validators.Student
{
    public class StudentRequestDtoValidator : AbstractValidator<StudentRequestDto>
    {
        public StudentRequestDtoValidator()
        {
            // --- Name Validation ---
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MaximumLength(100);

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(100);

            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender is required")
                .Must(g => new[] { "Male", "Female", "Other" }.Contains(g))
                .WithMessage("Gender must be Male, Female, or Other");

            RuleFor(x => x.BloodGroup)
    .Must(bg => string.IsNullOrEmpty(bg) || new[] { "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" }.Contains(bg))
    .WithMessage("Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-");


            // --- Date Validation ---
            RuleFor(x => x.DateOfBirth)
                .NotNull().WithMessage("Date of birth is required")
                .Must(dob => dob == null || dob.Value.ToDateTime(TimeOnly.MinValue) < DateTime.UtcNow)
                .WithMessage("Date of birth cannot be in the future");

            RuleFor(x => x.AdmissionDate)
                .NotNull().WithMessage("Admission date is required");

            // --- File Upload Validation ---
            RuleFor(x => x.PhotoFile)
                .Must(BeValidImage)
                .When(x => x.PhotoFile != null)
                .WithMessage("Photo must be JPG, JPEG, or PNG and less than 5MB");

            // --- Relationships ---
            RuleFor(x => x.GradeId)
                .GreaterThan(0).WithMessage("Please select a valid Grade");

            RuleFor(x => x.SectionId)
                .GreaterThan(0).WithMessage("Please select a valid Section");

            RuleFor(x => x.GuardianContact)
            .NotEmpty().WithMessage("Guardian contact is required")
            .Matches(@"^\d{10}$") 
            .WithMessage("Guardian contact must be exactly 10 digits");

        }

        // --- Helper method for validating uploaded image ---
        private bool BeValidImage(IFormFile file)
        {
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
